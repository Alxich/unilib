import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

import { AuthorInfo, Post } from "../../components";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import PostOperations from "../../graphql/operations/posts";
import { PostsByCatData, PostsCatVariables } from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";

const Author: FC<NextPage> = () => {
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  // Query for fetching posts by category using GraphQL and Apollo's useQuery hook
  const { data, loading, fetchMore } = useQuery<
    PostsByCatData,
    PostsCatVariables
  >(PostOperations.Queries.queryPostsByCat, {
    variables: {
      period: period !== "popular" ? period : "today",
      popular: period === "popular", // Set the 'popular' variable based on the selected period
      catId: id,
      skip: 0,
      take: 3,
    },
    // Callback when the query is completed successfully
    onCompleted(data) {
      // Clear the existing posts and set the fetched posts
      setPosts([]);
      setPosts(data.queryPostsByCat);
    },
    // Callback when an error occurs
    onError: ({ message }) => {
      // Display an error message using a toast notification
      toast.error(message);
    },
  });

  // Initialize state for posts, hasMore flag, and the fetchMore function
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();
  const [hasMore, setHasMore] = useState(true);

  // Fetch more posts when the 'period' or 'id' changes
  useEffect(() => {
    setPosts([]); // Clear existing posts
    fetchMore({
      variables: {
        period: period !== "popular" ? period : "today",
        popular: period === "popular",
        catId: id,
        skip: 0,
        take: 3,
      },
    });
  }, [period, id, fetchMore]);

  // Update 'posts' state when the data is fetched
  useEffect(() => {
    if (loading === false) {
      // If the query has loaded and data is available, update 'posts'
      data?.queryPostsByCat && setPosts(data.queryPostsByCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Function to fetch more posts when the user wants to load more
  const getMorePost = async () => {
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length,
          take: 1,
        },
      });

      // If no more new posts were fetched, set 'hasMore' to false
      if (newPosts.data.queryPostsByCat.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new fetched posts to the existing 'posts' array
      setPosts((post) => {
        return post && newPosts && [...post, ...newPosts.data.queryPostsByCat];
      });
    }

    return [];
  };

  return (
    <>
      <AuthorInfo
        type={"group"}
        period={period}
        setPeriod={setPeriod}
        id={id}
        session={session}
      />
      {loading ? (
        <h3> Loading...</h3>
      ) : (
        <>
          <div className="posts-container container">
            {posts && (
              <InfiniteScroll
                dataLength={posts.length}
                next={getMorePost}
                hasMore={hasMore}
                loader={<h3> Loading...</h3>}
                key={posts.map((item) => item.id).join("-")} // Unique key for posts array
                endMessage={
                  <p>
                    Вот і все. Ви переглянули весь інтернет і можете відпочити{" "}
                    {":)"}
                  </p>
                }
              >
                {posts.map((item: PostPopulated, i: number) => {
                  return (
                    <Post session={session} data={item} key={`${item}__${i}`} />
                  );
                })}
              </InfiniteScroll>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Author;
