import React, { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Content, PostPage, Comments } from "../../components";

import FourOhFour from "../404";

const Post: FC<{ id: any }> = ({ id }) => {
  return [] ? (
    <Content categories={[]} fandoms={[]}>
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
    </Content>
  ) : (
    <FourOhFour />
  );
};

export default Post;
