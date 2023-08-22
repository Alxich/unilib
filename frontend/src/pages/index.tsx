import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

import { Flowrange, Newestflow, Post } from "../components";
import { Postloading } from "../components/skeletons";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import { ContentViews, PostsData, PostsVariables } from "../util/types";
import { PostPopulated } from "../../../backend/src/util/types";
import PostOperations from "../graphql/operations/posts";
import { ContentContext, UserContext } from "../components/_content";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [period, setPeriod] = useContext(ContentContext);
  const [userSubscribed] = useContext(UserContext);
  const [rangeValue, setRangeValue] = useState<
    "year" | "today" | "week" | "month"
  >("year");

  useEffect(() => {
    setPeriod(rangeValue);
  }, [rangeValue, setPeriod]);

  // const [onceLoaded, setOnceLoaded] = useState(false);
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  const { data, loading, fetchMore } = useQuery<PostsData, PostsVariables>(
    PostOperations.Queries.queryPosts,
    {
      variables: {
        skip: 0,
        take: 3,
      },
      onCompleted(data) {
        setPosts(data.queryPosts);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  useEffect(() => {
    // Define an asynchronous function to update posts based on query parameters
    const updatedPostsByQuery = async (
      period: ContentViews,
      userSubscribed: string[] | undefined
    ) => {
      // Clear the current posts array
      setPosts([]);

      // Call the fetchMore function with updated variables
      const newData = await fetchMore({
        variables: {
          period:
            period !== "popular" && period !== "follow" ? period : "follow",
          popular: period === "popular",
          ...(period === "follow" &&
            userSubscribed && {
              subscribedCategories: userSubscribed,
            }),
          skip: 0,
          take: 3,
        },
      });

      // Update the posts with the new data
      if (newData.data.queryPosts) {
        setPosts(newData.data.queryPosts);
      }
    };

    // Call the function with the provided period and userSubscribed values
    updatedPostsByQuery(period, userSubscribed);
  }, [fetchMore, period, userSubscribed]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    // Check if there are already existing posts
    if (posts) {
      // Call the fetchMore function to get more posts
      const newPosts = await fetchMore({
        variables: {
          period:
            period !== "popular"
              ? period === "follow"
                ? "follow"
                : period
              : "today",
          popular: period === "popular", // Set the 'popular' variable based on the selected period
          ...(period === "follow" &&
            userSubscribed && {
              subscribedCategories: userSubscribed,
            }),
          skip: posts.length, // Skip the number of existing posts
          take: 1, // Fetch one more post
        },
      });

      // If no new posts were fetched, set hasMore to false
      if (newPosts.data.queryPosts.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new posts to the existing posts array
      setPosts((prevPosts) => {
        return prevPosts ? [...prevPosts, ...newPosts.data.queryPosts] : [];
      });
    }

    return [];
  };

  return (
    <>
      <Flowrange rangeValue={rangeValue} setRangeValue={setRangeValue} />
      <Newestflow />
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

export default Home;
