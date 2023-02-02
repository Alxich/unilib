import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../_button";

interface PostTypes {
  group: string;
  name: string;
  time: string;
  title: string;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  children: any;
}

const PostPage = ({
  group,
  name,
  time,
  title,
  tags,
  likesCount,
  commentsCount,
  viewsCount,
  children,
}: PostTypes) => {
  return (
    <div className="post post-wrapper">
      <div className="user-author">
        <div className="author">
          <div className="user-icon"></div>
          <div className="author-names">
            <div className="group">
              <p>{group}</p>
            </div>
            <div className="name">
              <p>
                {name}
                {" " + time}
              </p>
            </div>
          </div>
        </div>
        <Button small filled>
          Підписатися
        </Button>
      </div>
      <div className="content">
        <div className="title">
          <h3>{title}</h3>
        </div>
        <div className="text-block">{children}</div>
      </div>
      <div className="add-info">
        <div className="lt-side">
          <div className="hashtags">
            {tags.map((item, i) => {
              return <p key={`${item}__${i}`}>{item}</p>;
            })}
          </div>
        </div>
        <div className="rt-side">
          <div className="counters">
            <div className="views">
              <p>{viewsCount} Переглядів</p>
            </div>
            <div className="comments">
              <p>{commentsCount} Коментарів</p>
            </div>
          </div>
        </div>
      </div>
      <div className="interactions">
        <div className="lt-side">
          <div className="likes">
            <div className="fafont-icon likes">
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{likesCount}</p>
            </div>
          </div>
          <div className="fafont-icon dislike">
            <FontAwesomeIcon
              icon={faThumbsDown}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
        </div>
        <div className="rt-side">
          <div className="complain item interactive">
            <p>Поскаржитися</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
