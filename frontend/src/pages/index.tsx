import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";

import { Flowrange, Newestflow, Post } from "../components";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import { ContentViews, PostsData, PostsVariables } from "../util/types";
import { PostPopulated } from "../../../backend/src/util/types";
import PostOperations from "../graphql/operations/posts";
import { ContentContext, UserContext } from "../components/_content";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [period] = useContext(ContentContext);
  const [userSubscribed] = useContext(UserContext);

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
    // Call the queryPostsByCat function whenever the period changes
    const updatedPostsByQuery = async (
      period: ContentViews,
      userSubscribed: string[] | undefined
    ) => {
      setPosts([]);
      const newData = await fetchMore({
        variables: {
          period:
            period !== "popular" && period === "follow" ? "follow" : period,
          popular: period === "popular",
          ...(userSubscribed && {
            subscribedCategories: userSubscribed,
          }),
          skip: 0,
          take: 3,
        },
      });

      if (newData.data.queryPosts) {
        setPosts(newData.data.queryPosts);
      }
    };

    updatedPostsByQuery(period, userSubscribed);
  }, [fetchMore, period, userSubscribed]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          period:
            period !== "popular" && period === "follow" ? "follow" : period,
          popular: period === "popular",
          ...(userSubscribed && {
            subscribedCategories: userSubscribed,
          }),
          skip: posts.length,
          take: 1,
        },
      });

      if (newPosts.data.queryPosts.length === 0) {
        setHasMore(false);
        return null;
      }

      setPosts((prevPosts) => {
        return prevPosts ? [...prevPosts, ...newPosts.data.queryPosts] : [];
      });
    }

    return [];
  };

  return (
    <>
      <Flowrange />
      <Newestflow />
      <div className="posts-container container">
        {loading ? (
          <h3> Loading...</h3>
        ) : (
          posts && (
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePost}
              hasMore={hasMore}
              loader={<h3> Loading...</h3>}
              endMessage={
                <p>
                  Вот і все. Ви переглянули весь інтернет і може відочити {":)"}
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
