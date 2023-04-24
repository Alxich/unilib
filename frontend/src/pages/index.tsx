import { Content, Flowrange, Newestflow, Post } from "../components";

export default function Home() {
  return (
    <Content>
      <Flowrange />
      <Newestflow />
      <div className="posts-container container">
        {[].map((item: any, i: any) => {
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
