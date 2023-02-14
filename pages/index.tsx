import Image from "next/image";
import { dehydrate, useQuery } from "react-query";
import { queryClient, getPosts } from "../src/api";

import { Content, Flowrange, Newestflow, Post } from "../components";

export async function getServerSideProps() {
  await queryClient.prefetchQuery("posts", () => getPosts());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const { data } = useQuery(["posts"], () => getPosts());

  return (
    <Content>
      <Flowrange />
      <Newestflow />
      <div className="posts-container container">
        {data?.posts.map((item: any, i: any) => {
          const {
            group,
            name,
            time,
            title,
            likesCount,
            commentsCount,
            content,
          }: {
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
