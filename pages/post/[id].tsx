import React, { FC } from "react";
import Image from "next/image";
import { dehydrate, useQuery } from "react-query";
import {
  queryClient,
  getPosts,
  getCategories,
  getFandoms,
  postById,
} from "../../src/api";

import { Content, PostPage, Comments } from "../../components";

import FourOhFour from "../404";

export async function getServerSideProps() {
  await queryClient.prefetchQuery("posts", () => getPosts());
  await queryClient.prefetchQuery("categories", () => getCategories());
  await queryClient.prefetchQuery("fandoms", () => getFandoms());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Post: FC<{ id: any }> = ({ id }) => {
  const { data } = useQuery("post", () => postById({ id }));
  const postContent = data?.post;

  const categories = useQuery(["categories"], () => getCategories());
  const fandoms = useQuery(["fandoms"], () => getFandoms());

  return postContent ? (
    <Content
      categories={categories.data?.categories}
      fandoms={fandoms.data?.fandoms}
    >
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

export default Post;
