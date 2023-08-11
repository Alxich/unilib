import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

import { AuthorInfo, Comments, MoreAuthor, Post } from "../../../components";
import { Postloading } from "../../../components/skeletons";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import PostOperations from "../../../graphql/operations/posts";
import { PostsByAuthorData, PostsAuthorVariables } from "../../../util/types";
import { PostPopulated } from "../../../../../backend/src/util/types";

const Author: FC<NextPage> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  // Query for fetching posts by author using GraphQL and Apollo's useQuery hook
  const { data, loading, fetchMore } = useQuery<
    PostsByAuthorData,
    PostsAuthorVariables
  >(PostOperations.Queries.queryPostsByAuthor, {
    variables: {
      period: period !== "popular" ? period : "year",
      popular: period === "popular", // Set the 'popular' variable based on the selected period
      authorId: id,
      skip: 0,
      take: 3,
    },
    // Callback when an error occurs
    onError: ({ message }) => {
      // Display an error message using a toast notification
      toast.error(message);
    },
  });

  // Initialize state for 'onceLoaded', 'posts', and 'hasMore'
  const [onceLoaded, setOnceLoaded] = useState(false);
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();
  const [hasMore, setHasMore] = useState(true);

  // Effect to handle initial loading and set the 'posts' state
  useEffect(() => {
    // Check if loading is complete and the effect has not been triggered before
    if (onceLoaded !== true && loading === false) {
      // If data is available, update the 'posts' state and set 'onceLoaded' to true
      data?.queryPostsByAuthor && setPosts(data.queryPostsByAuthor);
      setOnceLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded, setOnceLoaded]);

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
      if (newPosts.data.queryPostsByAuthor.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new fetched posts to the existing 'posts' array
      setPosts((post) => {
        return (
          post && newPosts && [...post, ...newPosts.data.queryPostsByAuthor]
        );
      });
    }

    return [];
  };

  return (
    <>
      <AuthorInfo
        type="author"
        id={id}
        session={session}
        period={period}
        setPeriod={setPeriod}
        showMore={showMore}
        setShowMore={setShowMore}
        showComments={showComments}
        setShowComments={setShowComments}
      />
      {showComments !== false && session ? (
        <Comments session={session} userId={id} />
      ) : showMore !== false && session ? (
        <MoreAuthor id={id} session={session} />
      ) : (
        <div className="posts-container container">
          {loading ? (
            <>
              <Postloading />
              <Postloading />
              <Postloading />
            </>
          ) : (
            posts && (
              <InfiniteScroll
                dataLength={posts.length}
                next={getMorePost}
                hasMore={hasMore}
                loader={
                  <>
                    <Postloading />
                    <Postloading />
                    <Postloading />
                  </>
                }
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
            )
          )}
        </div>
      )}
    </>
  );
};

export default Author;
