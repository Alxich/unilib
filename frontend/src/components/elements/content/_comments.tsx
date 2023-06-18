import { FC } from "react";

import { CommentItem, CommentInput } from "./comments";

import { Session } from "next-auth";
import { CommentsItemProps } from "../../../util/types";

interface CommentsProps {
  session: Session;
  postId: string;
  commentArray?: CommentsItemProps[];
}

const Comments: FC<CommentsProps> = ({
  commentArray,
  session,
  postId,
}: CommentsProps) => {
  const complainItems = [
    {
      title: "Скарга за копірайт",
      text: "Якщо цей автор скопіював ваш коментар чи пост.",
    },
    {
      title: "Скарга за контент",
      text: "Якщо цей автор поширує невідповідний контент як NSFW і тд.",
    },
    {
      title: "Скарга на лексику",
      text: "Якщо автор використовує ненормативну лексику (Не у тему чи у вашу сторону).",
    },
    {
      title: "Домагання чи будь-що що може вам нашкодити",
      text: "Автор вам погрожує чи дає натяки на насилля над вами.",
    },
  ];

  return (
    <div id="comments" className="post-wrapper container">
      {commentArray && (
        <div className="title">
          <h3>Коментарів</h3>
          <div className="count">
            <p>{commentArray.length}</p>
          </div>
        </div>
      )}
      <CommentInput session={session} postId={postId} />
      {commentArray && (
        <div className="container comments-flow">
          {commentArray.map((item: CommentsItemProps, i: number) => {
            const { id, author, likes, dislikes, createdAt, content, replies } =
              item;
            return (
              <CommentItem
                key={`${id}__secondary__${i}`}
                id={id}
                author={author}
                likes={likes}
                dislikes={dislikes}
                createdAt={createdAt}
                content={content}
                replies={replies}
                complainItems={complainItems}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;
