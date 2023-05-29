import { FC } from "react";
import Link from "next/link";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../_button";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

interface PostProps {
  id: any;
  group: string;
  name: string;
  time: string;
  title: string;
  isFailPage?: boolean;
  likesCount: number;
  commentsCount: number;
  children: string;
}

const Post: FC<PostProps> = ({
  id,
  group,
  name,
  time,
  title,
  likesCount,
  commentsCount,
  isFailPage,
  children,
}: PostProps) => {
  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return <div className="text-block" dangerouslySetInnerHTML={{ __html: html }} />;
  };

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
          <Link href={`post/${id}`}>
            <h3>{title}</h3>
          </Link>
        </div>
        {isFailPage ? children : returnMeContent(children)}
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
