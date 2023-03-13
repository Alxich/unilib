import Image from "next/image";
import { dehydrate, useQuery } from "react-query";
import { queryClient, getPosts, getCategories, getFandoms } from "../src/api";

import { Content, Flowrange, Newestflow, Post } from "../components";

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

export default function Home() {
  const { data: postsArray } = useQuery(["posts"], () => getPosts());
  const { data: categories } = useQuery(["categories"], () => getCategories());
  const { data: fandoms } = useQuery(["fandoms"], () => getFandoms());

  return (
    <Content categories={categories?.categories} fandoms={fandoms?.fandoms}>
      <Flowrange />
      <Newestflow />
      <div className="posts-container container">
        {postsArray?.posts.map((item: any, i: any) => {
          const {
            id,
            group,
            name,
            time,
            title,
            likesCount,
            commentsCount,
            content,
          }: {
            id: any;
            group: string;
            name: string;
            time: string;
            title: string;
            likesCount: number;
            commentsCount: number;
            content: any;
          } = item;

          return (
            <Post
              key={`${item}__${i}`}
              id={id}
              group={group}
              name={name}
              time={time}
              title={title}
              likesCount={likesCount}
              commentsCount={commentsCount}
            >
              {content}
            </Post>
          );
        })}
      </div>
    </Content>
  );
}
