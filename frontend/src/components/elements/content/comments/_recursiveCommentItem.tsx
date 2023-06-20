import { FC, useEffect, useState } from "react";
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
  faTrashCan,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "../../_notification";

import { useMutation } from "@apollo/client";
import CommentOperations from "../../../../graphql/operations/comments";
import { CommentInteractionArguments } from "../../../../util/types";
import { formatTimeToPost } from "../../../../util/functions";
import { Comment } from "../../../../util/types";
import CommentInput from "./_commentInput";

interface RecursiveCommentItemProps {
  session: any;
  commentsData: Comment;
  complainItems: { title: string; text: string }[];
  postId?: string;
}

const RecursiveCommentItem: FC<RecursiveCommentItemProps> = ({
  session,
  commentsData,
  complainItems,
  postId,
}) => {
  const [activeElem, setActiveElem] = useState(false);
  const [answerActive, setAnswerActive] = useState(false);

  const [commentData, setCommentData] = useState<Comment>(commentsData);

  const { id, author, likes, text, createdAt, isDeleted, replies } =
    commentData;

  console.log(commentData);

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, TiptapImage]);

    return (
      <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  const [addLikeToComment] = useMutation<
    { addLikeToComment: Comment },
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
    { addDislikeToComment: Comment },
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

  const [deleteComment] = useMutation<
    { deleteComment: Comment },
    CommentInteractionArguments
  >(CommentOperations.Mutations.deleteComment, {
    onError: (error) => {
      console.error("deleteComment error", error);
      toast.error("Error occurred while deleting the comment");
    },
    onCompleted: (data) => {
      if (data.deleteComment) {
        // Update the component's state or trigger a refetch to update the data
        setCommentData(data.deleteComment);

        toast.success("Comment was deleted!");
      } else {
        toast.error("Failed to delete the comment");
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

  const onDeleteComment = async () => {
    /**
     * This func allow author to delete a comment
     * It will not delete at all but change the content
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

      //Check if author id same as user id
      if (author.id !== session?.user.id) {
        throw new Error("You are not the author!");
      }

      const { data, errors } = await deleteComment({
        variables: {
          id: id,
        },
      });

      if (!data?.deleteComment || errors) {
        throw new Error("Error onDeleteComment when trying to delete");
      }

      if (!errors) {
        toast.success("Comment was deleted!");
      }
    } catch (error: any) {
      console.error("onDeleteComment error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="item">
      <div className="main-content">
        {session && author?.id === session.user.id && (
          <div className="fafont-icon interactive delete">
            <FontAwesomeIcon
              icon={faTrashCan}
              style={{
                width: "100%",
                height: "100%",
                color: "inherit",
              }}
              onClick={(e) => {
                e.preventDefault();
                onDeleteComment();
              }}
            />
          </div>
        )}
        <div className="user-author">
          <div className="author">
            <div className="user-icon">
              {!isDeleted && author?.image && (
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
                <p>{isDeleted ? "Ескапад автора" : author?.username}</p>
              </div>
              <div className="time">
                <p> {" " + formatTimeToPost(createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
        {text && returnMeContent(text)}
        <div className="interactions">
          <div className="lt-side">
            <div
              className="answer"
              onClick={(e) => {
                e.preventDefault();
                setAnswerActive(answerActive ? false : true);
              }}
            >
              <p>Відповісти</p>
              <div className="fafont-icon arrow-down">
                <FontAwesomeIcon
                  icon={answerActive ? faChevronUp : faChevronDown}
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
            {replies != undefined && replies && (
              <div className="answer-count">
                <p>{replies.length} Відповідь</p>
              </div>
            )}
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
        {answerActive && (
          <CommentInput postId={postId} session={session} parentId={id} />
        )}
      </div>
      {replies != undefined && replies.length > 0 && (
        <div className="comments-to-item">
          {replies.map((item, i: any) => (
            <RecursiveCommentItem
              key={`${item.id}__recursive__${i}`}
              session={session}
              commentsData={item}
              complainItems={complainItems}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecursiveCommentItem;
