import React, { FC } from "react";
import { useRouter } from "next/router";
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

export async function getServerSideProps(context: any) {
  const { id: postId } = context.query;

  await queryClient.prefetchQuery("post", () => postById({ id: postId }));
  await queryClient.prefetchQuery("categories", () => getCategories());
  await queryClient.prefetchQuery("fandoms", () => getFandoms());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: String(postId),
    },
  };
}

const Post: FC<{ id: any }> = ({ id }) => {
  const { data } = useQuery("post", () => postById({ id: id }));
  const postContent = data?.post;

  const categories = useQuery(["categories"], () => getCategories());
  const fandoms = useQuery(["fandoms"], () => getFandoms());

  console.log(postContent);

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
