import React, { FC } from "react";
import Image from "next/image";
import { dehydrate, useQuery } from "react-query";

import { queryClient, postById } from "../../src/api";

import { Content, PostPage, Comments } from "../../components";

import FourOhFour from "../404";

const Post: FC<{ id: any }> = ({ id }) => {
  const { data } = useQuery("post", () => postById({ id }));
  console.log(data);
  const postContent = data?.post;

  return postContent ? (
    <Content>
      <div className="posts-container container">
        <PostPage
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
        <Comments commentArray={postContent.comments} />
      </div>
    </Content>
  ) : (
    <FourOhFour />
  );
};

export async function getServerSideProps({ params }: { params: any }) {
  console.log(params.id);
  await queryClient.prefetchQuery("post", () => postById({ id: params.id }));

  return {
    props: {
      id: params.id || null,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Post;
