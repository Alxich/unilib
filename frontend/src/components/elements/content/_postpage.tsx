import { FC, useState } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import { formatTimeToPost } from "../../../util/functions";
import { PostData } from "../../../util/types";

import Button from "../_button";

import { toast } from "react-hot-toast";
import { Session } from "next-auth";

import { useMutation } from "@apollo/client";
import PostsOperations from "../../../graphql/operations/posts";
import { PostInteractionArguments } from "../../../util/types";
import { PostPopulated } from "../../../../../backend/src/util/types";

interface PostPageProps {
  data: PostData;
  session: Session | null;
}

const PostPage: FC<PostPageProps> = ({ data, session }) => {
  const [postData, setPostData] = useState<PostPopulated>(data.queryPost);

  const {
    id: postID,
    title,
    author,
    category,
    content,
    createdAt,
    dislikes,
    likes,
    tags,
    views,
  } = postData;

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return (
      <div className="text-block" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

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
            id: postID,
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
            id: postID,
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

  return (
    <div className="post post-wrapper">
      <div className="user-author">
        <div className="author">
          <div className="user-icon"></div>
          <div className="author-names">
            <Link href={`/group/${category.id}`} className="group">
              <p>{category.title}</p>
            </Link>
            <div className="name">
              <Link href={`/author/${author.id}`}>
                {author.username ? author.username : "Unknown"}
                {" " + formatTimeToPost(createdAt)}
              </Link>
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
        <div className="text-block">{returnMeContent(content)}</div>
      </div>
      <div className="add-info">
        <div className="lt-side">
          {tags.length && (
            <div className="hashtags">
              {tags.map((item, i) => {
                return (
                  <Link href={`/tag/${item.id}`} key={`${item}__${i}`}>
                    {"#" + item.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="rt-side">
          <div className="counters">
            <div className="views">
              <p>{views} Переглядів</p>
            </div>
            <div className="comments">
              {/**
               * Leave here a comments count later
               */}
              <p>{views} Коментарів</p>
            </div>
          </div>
        </div>
      </div>
      <div className="interactions">
        <div className="lt-side">
          <div className="likes">
            <div
              className="fafont-icon likes"
              onClick={() => onPostInteraction(true)}
            >
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{likes != null ? likes : 0}</p>
            </div>
          </div>
          {/* <div className="dislikes">
            <div
              className="fafont-icon dislike"
              onClick={() => onPostInteraction(false)}
            >
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{dislikes != null ? dislikes : 0}</p>
            </div>
          </div> */}
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
