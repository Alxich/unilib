import { FC, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faHeart,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "../../_notification";
import UsualItem from "./_usualItem";

import { useMutation } from "@apollo/client";
import CommentOperations from "../../../../graphql/operations/comments";
import {
  CommentInteractionArguments,
  CommentItemProps,
} from "../../../../util/types";
import { formatTimeToPost } from "../../../../util/functions";
import { CommentPopulated } from "../../../../../../backend/src/util/types";

const CommentItem: FC<CommentItemProps> = ({
  session,
  commentsData,
  complainItems,
}: CommentItemProps) => {
  const [activeElem, setActiveElem] = useState(false);
  const [commentData, setCommentData] = useState<CommentPopulated>(commentsData);

  const {
    id,
    author,
    likes,
    dislikes,
    text,
    createdAt,
    parentId,
  } = commentData;

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, TiptapImage]);

    return (
      <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  const [addLikeToComment] = useMutation<
    { addLikeToComment: CommentPopulated },
    CommentInteractionArguments
  >(CommentOperations.Mutations.addLikeToComment, {
    onError: (error) => {
      console.error("addLikeToComment error", error);
      toast.error("Error occurred while liking the comment");
    },
    onCompleted: (data) => {
      if (data.addLikeToComment) {
        // Update the component's state or trigger a refetch to update the data
        setCommentData(data.addLikeToComment);

        toast.success("Comment was liked!");
      } else {
        toast.error("Failed to like the comment");
      }
    },
  });

  const [addDislikeToComment] = useMutation<
    { addDislikeToComment: CommentPopulated },
    CommentInteractionArguments
  >(CommentOperations.Mutations.addDislikeToComment, {
    onError: (error) => {
      console.error("addDislikeToComment error", error);
      toast.error("Error occurred while disliking the comment");
    },
    onCompleted: (data) => {
      if (data.addDislikeToComment) {
        // Update the component's state or trigger a refetch to update the data
        setCommentData(data.addDislikeToComment);

        toast.success("Comment was disliked!");
      } else {
        toast.error("Failed to dislike the comment");
      }
    },
  });

  const onCommentInteraction = async (type: boolean) => {
    /**
     * If it is true its means we want to like the comment
     * else if it is false its means to dislike the comment
     */
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if user exist to make comment secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      if (type != false) {
        const { data, errors } = await addLikeToComment({
          variables: {
            id: id,
          },
        });

        if (!data?.addLikeToComment || errors) {
          throw new Error("Error onLikeComment when trying to like");
        }

        if (!errors) {
          toast.success("Comment was liked!");
        }
      } else {
        const { data, errors } = await addDislikeToComment({
          variables: {
            id: id,
          },
        });

        if (!data?.addDislikeToComment || errors) {
          throw new Error("Error addDislikeToComment when trying to dislike");
        }

        if (!errors) {
          toast.success("Comment was disliked!");
        }
      }
    } catch (error: any) {
      console.error("onCommentInteraction error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="item">
      <div className="main-content">
        <div className="user-author">
          <div className="author">
            <div className="user-icon">
              {author?.image && (
                <Image
                  src={author.image}
                  height={1080}
                  width={1920}
                  alt="author-background"
                />
              )}
            </div>

            <div className="author-names">
              <div className="name">
                <p>{author.username}</p>
              </div>
              <div className="time">
                <p> {" " + formatTimeToPost(createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
        {returnMeContent(text)}
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
            {/* {replies && (
              <div className="answer-count">
                <p>{replies.length} Відповідь</p>
              </div>
            )} */}
          </div>
          <div className="rt-side">
            <div className="heart">
              <div className="fafont-icon interactive heart">
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    onCommentInteraction(true);
                  }}
                />
              </div>
              <div className="counter">
                <p>{likes}</p>
              </div>
            </div>
            <div className="fafont-icon interactive dislike">
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{
                  width: "100%",
                  height: "100%",
                  color: "inherit",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onCommentInteraction(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* {replies.length > 0 && (
        <div className="comments-to-item">
          {replies.map((item: CommentsItemProps, i: any) => {
            const { id, author, likes, dislikes, createdAt, content, replies } =
              item;
            return (
              <UsualItem
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
      )} */}
    </div>
  );
};

export default CommentItem;
