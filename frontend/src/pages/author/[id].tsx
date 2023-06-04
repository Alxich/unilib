import type { NextPage } from "next";
import Image from "next/image";

import { AuthorInfo, MoreAuthor, Post } from "../../components";

const Author: NextPage = () => {
  return (
    <>
      <AuthorInfo />
      {/* <MoreAuthor /> */}
      <div className="posts-container container">
        {[].map((item, i) => {
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
    </>
  );
};

export default Author;
