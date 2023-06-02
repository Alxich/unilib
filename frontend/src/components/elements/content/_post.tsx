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

import { formatTimeToPost } from "../../../util/functions";
import { PostFail } from "../../../util/types";
import { PostPopulated } from "../../../../../backend/src/util/types";

interface PostPageProps {
  data: PostPopulated | PostFail;
  isFailPage?: boolean;
  children?: any | string;
}

const Post: FC<PostPageProps> = ({
  data,
  isFailPage,
  children,
}: PostPageProps) => {
  if (isFailPage) {
    const { title } = data as PostFail;

    return (
      <div
        className={classNames("post post-wrapper", {
          "fail-page": isFailPage,
        })}
      >
        <div className="content">
          <div className="title">
            <Link href={`404`}>
              <h3>{title}</h3>
            </Link>
          </div>
          <div className="text-block">{children}</div>
        </div>
      </div>
    );
  }

  const { id, title, author, category, content, createdAt, likes } =
    data as PostPopulated;

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return (
      <div className="text-block" dangerouslySetInnerHTML={{ __html: html }} />
    );
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
            <Link href={`/group/${category.id}`} className="group">
              <p>{category.title}</p>
            </Link>
            <Link href={"/author/1"} className="name">
              <p>
                {author.username ? author.username : "Unknown"}
                {" " + formatTimeToPost(createdAt)}
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
        {returnMeContent(content)}
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
              <p>{likes != null ? likes : 0}</p>
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
              <p>
                {/**
                 * Must be here a comment count etc
                 */}
                0
              </p>
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
