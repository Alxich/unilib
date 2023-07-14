import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";

import { AuthorInfo, Post } from "../../components";

import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { PostsByCatData, PostsCatVariables } from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";

import InfiniteScroll from "react-infinite-scroll-component";

const Author: FC<NextPage> = () => {
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  const { data, loading, fetchMore } = useQuery<
    PostsByCatData,
    PostsCatVariables
  >(PostOperations.Queries.queryPostsByCat, {
    variables: {
      period: period !== "popular" ? period : "today",
      popular: period === "popular", // Set the popular variable based on the selected period
      catId: id,
      skip: 0,
      take: 3,
    },
    onCompleted(data) {
      setPosts([]);
      setPosts(data.queryPostsByCat);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    setPosts([]);
    // Call the queryPostsByCat function whenever the period changes
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

  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  useEffect(() => {
    if (loading == false) {
      data?.queryPostsByCat && setPosts(data.queryPostsByCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length,
          take: 1,
        },
      });

      if (newPosts.data.queryPostsByCat.length === 0) {
        setHasMore(false);
        return null;
      }

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
