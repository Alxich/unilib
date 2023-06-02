import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";

import { toast } from "react-hot-toast";

import { PostPage, Comments } from "../../components";

import FourOhFour from "../404";
import { PostData, PostVariables } from "../../util/types";
import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Post: FC<NextPage> = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  const [postData, setPostData] = useState<PostData>();

  const { data, loading, error } = useQuery<PostData, PostVariables>(
    PostOperations.Queries.queryPost,
    {
      variables: { id },
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  useEffect(() => {
    loading != true && setPostData(data);
  }, [data, loading]);

  if (error) {
    console.error(error.message);
  }

  if (loading == false && !id) {
    toast.error("There is no id for the post");
  }

  // Note fix props

  return loading ? (
    <div>LOADING...</div>
  ) : (
    <div className="posts-container container">
      {postData ? (
        <>
          <PostPage data={postData} session={session} />
          {/* <Comments commentArray={postData.comments} /> */}
        </>
      ) : (
        <FourOhFour />
      )}
    </div>
  );
};

export default Post;
