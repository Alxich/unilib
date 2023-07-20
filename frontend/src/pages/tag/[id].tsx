import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";

import { AuthorInfo, Post } from "../../components";

import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { PostsByTagsData, PostsTagVariables } from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";

import InfiniteScroll from "react-infinite-scroll-component";

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
      period: period !== "popular" ? period : "today",
      popular: period === "popular", // Set the popular variable based on the selected period
      tagId: id,
      skip: 0,
      take: 3,
    },
    onCompleted(data) {
      setPosts(data.queryPostsByTag);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    // Call the queryPostsByTag function whenever the period changes
    const updatedPostsByQuery = async (period: string) => {
      setPosts([]);
      const newData = await fetchMore({
        variables: {
          period: period !== "popular" ? period : "today",
          popular: period === "popular", // Set the popular variable based on the selected period
          tagId: id,
          skip: 0,
          take: 3,
        },
      });

      if (newData.data.queryPostsByTag) {
        setPosts(newData.data.queryPostsByTag);
      }
    };

    updatedPostsByQuery(period);
  }, [fetchMore, id, period]);

  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    if (posts) {
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length,
          take: 1,
        },
      });

      if (newPosts.data.queryPostsByTag.length === 0) {
        setHasMore(false);
        return null;
      }

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
          <h3> Loading...</h3>
        ) : (
          posts && (
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
          )
        )}
      </div>
    </>
  );
};

export default TagPage;
