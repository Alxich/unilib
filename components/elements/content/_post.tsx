import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../_button";
import classNames from "classnames";
import Link from "next/link";

interface PostTypes {
  group: string;
  name: string;
  time: string;
  title: string;
  isFailPage?: boolean;
  likesCount: number;
  commentsCount: number;
  children: any;
}

const Post = ({
  group,
  name,
  time,
  title,
  likesCount,
  commentsCount,
  isFailPage,
  children,
}: PostTypes) => {
  return (
    <div
      className={classNames("post post-wrapper", {
        "fail-page": isFailPage,
      })}
    >
      <div className="user-author">
        <div className="author">
          <Link href={"/group/1"} className="user-icon"></Link>
          <div className="author-names">
            <Link href={"/group/1"} className="group">
              <p>{group}</p>
            </Link>
            <Link href={"/author/1"} className="name">
              <p>
                {name}
                {" " + time}
              </p>
            </Link>
          </div>
        </div>
        <Button small filled>
          Підписатися
        </Button>
      </div>
      <div className="content">
        <div className="title">
          <Link href={"post/1"}>
            <h3>{title}</h3>
          </Link>
        </div>
        <div className="text-block">{children}</div>
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
          <div className="comments">
            <div className="fafont-icon comments">
              <FontAwesomeIcon
                icon={faComments}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{commentsCount}</p>
            </div>
          </div>
        </div>
        <div className="rt-side">
          <div className="fafont-icon dislike interactive">
            <FontAwesomeIcon
              icon={faThumbsDown}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
