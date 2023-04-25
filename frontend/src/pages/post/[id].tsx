import React, { FC } from "react";
import type { NextPage } from "next";

import { Content, PostPage, Comments } from "../../components";

import FourOhFour from "../404";

interface PostProps {
  id: any;
}

const Post: FC<PostProps & NextPage> = ({ id }: PostProps) => {
  return [] ? (
    <div className="posts-container container">
      {/* <PostPage
          group={postContent.group}
          name={postContent.name}
          time={postContent.time}
          title={postContent.title}
          tags={postContent.tags}
          likesCount={postContent.likesCount}
          commentsCount={postContent.commentsCount}
          viewsCount={postContent.viewsCount}
        >
          {postContent.content}
        </PostPage>
        <Comments commentArray={postContent.comments} /> */}
    </div>
  ) : (
    <FourOhFour />
  );
};

export default Post;
