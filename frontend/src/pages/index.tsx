import type { NextPage } from "next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";

import { Flowrange, Newestflow, Post } from "../components";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

import { PostsData, PostsVariables } from "../util/types";
import { PostPopulated } from "../../../backend/src/util/types";
import PostOperations from "../graphql/operations/posts";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const { data, loading, fetchMore } = useQuery<PostsData, PostsVariables>(
    PostOperations.Queries.queryPosts,
    {
      variables: {
        skip: 0,
        take: 3,
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const [onceLoaded, setOnceLoaded] = useState(false);
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  useEffect(() => {
    if (onceLoaded != true && loading == false) {
      data?.queryPosts && setPosts(data.queryPosts);
      setOnceLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded, setOnceLoaded]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length,
          take: 1,
        },
      });

      if (newPosts.data.queryPosts.length === 0) {
        setHasMore(false);
        return null;
      }

      setPosts((post) => {
        return post && newPosts && [...post, ...newPosts.data.queryPosts];
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
              endMessage={<h4>Nothing more to show</h4>}
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
