import { Content, AuthorInfo, Post } from "../../components";

const Author = () => {
  return (
    <Content>
      <AuthorInfo />
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
    </Content>
  );
};

export default Author;
