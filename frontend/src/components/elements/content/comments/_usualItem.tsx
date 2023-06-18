import { FC, useState } from "react";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faHeart,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "../../_notification";
import CommentItem from "./_commentItem";

import { CommentsItemProps } from "../../../../util/types";

const UsualItem: FC<CommentsItemProps> = ({
  author,
  likes,
  content,
  createdAt,
  replies,
  complainItems,
}: CommentsItemProps) => {
  const [activeElem, setActiveElem] = useState(false);

  return (
    <div className="item">
      <div className="main-content">
        <div className="user-author">
          <div className="author">
            {author?.image && (
              <div className="user-icon">
                <Image
                  src={author.image}
                  height={1080}
                  width={1920}
                  alt="author-background"
                />
              </div>
            )}
            <div className="author-names">
              <div className="name">
                <p>{author.username}</p>
              </div>
              <div className="time">
                <p>{createdAt}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content">{content}</div>
        <div className="interactions">
          <div className="lt-side">
            <div className="answer">
              <p>Відповісти</p>
              <div className="fafont-icon arrow-down">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                  }}
                />
              </div>
            </div>
            <div
              className="complain"
              onClick={() => setActiveElem(activeElem ? false : true)}
            >
              <p>Поскаржитися</p>
              <Notification
                items={complainItems}
                type={"complain"}
                activeElem={activeElem}
              />
            </div>
            {replies && (
              <div className="answer-count">
                <p>{replies.length} Відповідь</p>
              </div>
            )}
          </div>
          <div className="rt-side">
            <div className="heart">
              <div className="fafont-icon heart">
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                  }}
                />
              </div>
              <div className="counter">
                <p>{likes}</p>
              </div>
            </div>
            <div className="fafont-icon dislike">
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{
                  width: "100%",
                  height: "100%",
                  color: "inherit",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {replies.length > 0 && (
        <div className="comments-to-item">
          {replies.map((item: CommentsItemProps, i: any) => {
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

export default UsualItem;
