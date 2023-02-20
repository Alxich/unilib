import Image from "next/image";

import { Content, AuthorInfo, MoreAuthor, Post } from "../../components";

import { dehydrate, useQuery } from "react-query";
import {
  queryClient,
  getPosts,
  getCategories,
  getFandoms,
} from "../../src/api";

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

const Author = () => {
  const postsArray = useQuery(["posts"], () => getPosts());
  const categories = useQuery(["categories"], () => getCategories());
  const fandoms = useQuery(["fandoms"], () => getFandoms());

  return (
    <Content
      categories={categories.data?.categories}
      fandoms={fandoms.data?.fandoms}
    >
      <AuthorInfo />
      <div className="posts-container container">
        {postsArray.data?.posts.map((item, i) => {
          const {
            id,
            group,
            name,
            time,
            title,
            likesCount,
            commentsCount,
            content,
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
};

export default Author;
