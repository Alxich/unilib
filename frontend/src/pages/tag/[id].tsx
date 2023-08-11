import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

import { AuthorInfo, Post } from "../../components";
import { Postloading } from "../../components/skeletons";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import PostOperations from "../../graphql/operations/posts";
import { PostsByTagsData, PostsTagVariables } from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";

const TagPage: FC<NextPage> = () => {
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  const { data, loading, fetchMore } = useQuery<
    PostsByTagsData,
    PostsTagVariables
  >(PostOperations.Queries.queryPostsByTag, {
    variables: {
      period: period !== "popular" ? period : "today", // Set the period variable based on the selected period
      popular: period === "popular", // Set the popular variable based on the selected period
      tagId: id, // The ID of the tag to filter posts by
      skip: 0, // Number of posts to skip (starting from the first post)
      take: 3, // Number of posts to fetch
    },
    onCompleted(data) {
      setPosts(data.queryPostsByTag); // Update the state with fetched posts
    },
    onError: ({ message }) => {
      toast.error(message); // Display an error message using a toast
    },
  });

  useEffect(() => {
    // Call the queryPostsByTag function whenever the period changes
    const updatedPostsByQuery = async (period: string) => {
      setPosts([]); // Clear the current posts to initiate a new fetch
      const newData = await fetchMore({
        variables: {
          period: period !== "popular" ? period : "today", // Set the period variable based on the selected period
          popular: period === "popular", // Set the popular variable based on the selected period
          tagId: id, // The ID of the tag used to filter posts
          skip: 0, // Number of posts to skip (starting from the first post)
          take: 3, // Number of posts to fetch
        },
      });

      if (newData.data.queryPostsByTag) {
        setPosts(newData.data.queryPostsByTag); // Update the state with fetched posts
      }
    };

    updatedPostsByQuery(period); // Call the function with the initial period value
  }, [fetchMore, id, period]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    // Check if there are already posts in the state
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length, // Set the skip count to the current number of posts
          take: 1, // Fetch a single new post
        },
      });

      // No more new posts, set hasMore to false
      if (newPosts.data.queryPostsByTag.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append new posts to the existing list
      setPosts((post) => {
        return post && newPosts && [...post, ...newPosts.data.queryPostsByTag];
      });
    }

    return [];
  };

  return (
    <>
      <AuthorInfo
        type="tag"
        id={id}
        session={session}
        period={period}
        setPeriod={setPeriod}
      />
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
    </>
  );
};

export default TagPage;
