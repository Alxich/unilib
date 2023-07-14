import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";

import { AuthorInfo, Comments, MoreAuthor, Post } from "../../components";

import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { PostsByAuthorData, PostsAuthorVariables } from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";

import InfiniteScroll from "react-infinite-scroll-component";

const Author: FC<NextPage> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  const { data, loading, fetchMore } = useQuery<
    PostsByAuthorData,
    PostsAuthorVariables
  >(PostOperations.Queries.queryPostsByAuthor, {
    variables: {
      period: period !== "popular" ? period : "year",
      popular: period === "popular", // Set the popular variable based on the selected period
      authorId: id,
      skip: 0,
      take: 3,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const [onceLoaded, setOnceLoaded] = useState(false);
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  useEffect(() => {
    if (onceLoaded != true && loading == false) {
      data?.queryPostsByAuthor && setPosts(data.queryPostsByAuthor);
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

      if (newPosts.data.queryPostsByAuthor.length === 0) {
        setHasMore(false);
        return null;
      }

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
      )}
    </>
  );
};

export default Author;
