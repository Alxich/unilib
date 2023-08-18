import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-toastify";

import { PostPage, Comments } from "../../components";
import FourOhFour from "../404";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { PostData, PostVariables } from "../../util/types";
import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { Postloading } from "../../components/skeletons";
import classNames from "classnames";

const Post: FC<NextPage> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [postCommentsCount, setPostCommentsCount] = useState<number>();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  const [postData, setPostData] = useState<PostData>();

  // Fetching a single post using GraphQL query
  const { data, loading, error } = useQuery<PostData, PostVariables>(
    PostOperations.Queries.queryPost,
    {
      variables: { id },
      // Handle error during query execution
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  // Set the state 'postData' once data is loaded and not in loading state
  useEffect(() => {
    if (loading !== true) {
      setPostData(data);
    }
  }, [data, loading]);

  // Log the error message if an error occurred during the query
  if (error) {
    console.error(error.message);
  }

  // If loading is complete and no valid post ID is provided, show an error toast
  if (loading === false && !id) {
    toast.error("There is no id for the post");
  }

  return (
    <div
      className={classNames("posts-container container", {
        "loading-component": loading,
      })}
    >
      {loading ? (
        <Postloading />
      ) : postData ? (
        <>
          <PostPage
            data={postData}
            session={session}
            postCommentsCount={postCommentsCount}
          />
          {session && (
            <Comments
              session={session}
              postId={postData.queryPost.id}
              setPostCommentsCount={setPostCommentsCount}
              userId={session.user.id}
            />
          )}
        </>
      ) : (
        <FourOhFour />
      )}
    </div>
  );
};

export default Post;
