import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import { CommentItem } from "./comments";

const Comments = ({ commentArray }: { commentArray: any }) => {
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
      <div className="title">
        <h3>Коментарів</h3>
        <div className="count">
          <p>62</p>
        </div>
      </div>
      <form className="comment">
        <textarea placeholder="Написати свій коментар ..." />
        <button className="fafont-icon image post-image">
          <FontAwesomeIcon
            icon={faImages}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </button>
      </form>
      <div className="container comments-flow">
        {commentArray.map((item: any, i: Number) => {
          const { author, likes, content, answers } = item;
          return (
            <CommentItem
              key={`${item}__main__${i}`}
              author={author}
              likes={likes}
              content={content}
              answers={answers}
              complainItems={complainItems}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
