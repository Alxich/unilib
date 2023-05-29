import React, { FC } from "react";
import type { NextPage } from "next";

import { toast } from "react-hot-toast";

import { Content, PostPage, Comments } from "../../components";

import FourOhFour from "../404";
import { PostData, PostVariables } from "../../util/types";
import { useQuery } from "@apollo/client";
import PostOperations from "../../graphql/operations/posts";
import { useRouter } from "next/router";

const Post: FC<NextPage> = ({}) => {
  const router = useRouter();

  const id = router.query.id;

  const { data, loading, error } = useQuery<PostData, PostVariables>(
    PostOperations.Queries.queryPost,
    {
      variables: { id },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  if (error) {
    toast.error(error.message);
  }

  const postData = data?.queryPost;

  // return loading ? (
  //   <div>LOADING...</div>
  // ) : postData ? (
  //   <div className="posts-container container">
  //     {/* <PostPage
  //           group={postData.category.title}
  //           name={postData.author.username}
  //           time={postData.createdAt}
  //           title={postData.title}
  //           tags={postData.tags}
  //           likesCount={postData.likesCount}
  //           commentsCount={postData.commentsCount}
  //           viewsCount={postData.viewsCount}
  //         >
  //           {postData.content}
  //         </PostPage> */}
  //     {/* <Comments commentArray={postData.comments} /> */}
  //   </div>
  // ) : (
  //   <FourOhFour />
  // );
};

export default Post;
