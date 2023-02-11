import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faHeart,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "../../_notification";

interface commentsItemTypes {
  author: {
    name: string;
    time: string;
  };
  likes: number;
  content: any;
  answers: any;
  complainItems: { title: string; text: string }[];
}

const UsualItem = ({
  author,
  likes,
  content,
  answers,
  complainItems,
}: commentsItemTypes) => {
  const [activeElem, setActiveElem] = React.useState(false);

  return (
    <div className="item">
      <div className="main-content">
        <div className="user-author">
          <div className="author">
            <div className="user-icon"></div>
            <div className="author-names">
              <div className="name">
                <p>{author.name}</p>
              </div>
              <div className="time">
                <p>{author.time}</p>
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
            {answers && (
              <div className="answer-count">
                <p>{answers.length} Відповідь</p>
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
    </div>
  );
};

export default UsualItem;
