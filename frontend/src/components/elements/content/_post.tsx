import { FC, useState } from "react";
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

import { toast } from "react-hot-toast";

import { Session } from "next-auth";

import { useMutation } from "@apollo/client";
import PostsOperations from "../../../graphql/operations/posts";
import { PostFail, PostInteractionArguments } from "../../../util/types";
import { PostPopulated } from "../../../../../backend/src/util/types";

interface PostPageProps {
  session: Session | null;
  data: PostPopulated | PostFail;
  isFailPage?: boolean;
  children?: any | string;
}

const Post: FC<PostPageProps> = ({
  session,
  data,
  isFailPage,
  children,
}: PostPageProps) => {
  const [postData, setPostData] = useState<PostPopulated>(
    data as PostPopulated
  );

  const [addLikeToPost] = useMutation<
    { addLikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addLikeToPost, {
    onError: (error) => {
      console.error("addLikeToPost error", error);
      toast.error("Error occurred while liking the post");
    },
    onCompleted: (data) => {
      if (data.addLikeToPost) {
        // Update the component's state or trigger a refetch to update the data
        setPostData(data.addLikeToPost);

        toast.success("Post was liked!");
      } else {
        toast.error("Failed to like the post");
      }
    },
  });

  const [addDislikeToPost] = useMutation<
    { addDislikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addDislikeToPost, {
    onError: (error) => {
      console.error("addDislikeToPost error", error);
      toast.error("Error occurred while disliking the post");
    },
    onCompleted: (data) => {
      if (data.addDislikeToPost) {
        // Update the component's state or trigger a refetch to update the data
        setPostData(data.addDislikeToPost);

        toast.success("Post was disliked!");
      } else {
        toast.error("Failed to dislike the post");
      }
    },
  });

  const { id, title, author, category, content, createdAt, likes } =
    postData as PostPopulated;

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return (
      <Link
        href={`/post/${id}`}
        className="text-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  const onPostInteraction = async (type: boolean) => {
    /**
     * If it is true its means we want to like the post
     * else if it is false its means to dislike the post
     */

    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      if (type != false) {
        const { data, errors } = await addLikeToPost({
          variables: {
            id: id,
          },
        });

        if (!data?.addLikeToPost || errors) {
          throw new Error("Error onLikePost when trying to like");
        }

        if (!errors) {
          toast.success("Post was liked!");
        }
      } else {
        const { data, errors } = await addDislikeToPost({
          variables: {
            id: id,
          },
        });

        if (!data?.addDislikeToPost || errors) {
          throw new Error("Error addDislikeToPost when trying to dislike");
        }

        if (!errors) {
          toast.success("Post was disliked!");
        }
      }
    } catch (error: any) {
      console.error("onPostInteraction error", error);
      toast.error(error?.message);
    }
  };

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
            <Link href={`/author/${author.id}`} className="name">
              {author.username ? author.username : "Unknown"}
              {" " + formatTimeToPost(createdAt)}
            </Link>
          </div>
        </div>
        <Button small filled>
          Підписатися
        </Button>
      </div>

      <div className="content">
        <div className="title">
          <Link href={`/post/${id}`}>
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
                onClick={() => onPostInteraction(true)}
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
              onClick={() => onPostInteraction(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
