import type { NextPage } from "next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";
import { formatRelative } from "date-fns";

import { Flowrange, Newestflow, Post } from "../components";

import { useQuery } from "@apollo/client";
import { PostsData, PostsVariables } from "../util/types";
import { PostPopulated } from "../../../backend/src/util/types";
import PostOperations from "../graphql/operations/posts";
import enUS from "date-fns/locale/en-US";

const Home: NextPage = () => {
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
    console.log(data);
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

  const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
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
                const {
                  id,
                  title,
                  content,
                  category,
                  author,
                  createdAt,
                  likes,
                  tags,
                } = item;

                return (
                  <Post
                    key={`${item}__${i}`}
                    id={id}
                    group={category?.title}
                    name={author.username ? author.username : "Author"}
                    time={formatRelative(createdAt, new Date(), {
                      locale: {
                        ...enUS,
                        formatRelative: (token) =>
                          formatRelativeLocale[
                            token as keyof typeof formatRelativeLocale
                          ],
                      },
                    })}
                    title={title}
                    likesCount={likes ? likes : 0}
                    commentsCount={likes ? likes : 0}
                  >
                    {content}
                  </Post>
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
