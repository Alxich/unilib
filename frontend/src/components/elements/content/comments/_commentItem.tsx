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
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "../../_notification";

import { useMutation, useSubscription } from "@apollo/client";
import CommentOperations from "../../../../graphql/operations/comments";
import {
  Comment,
  CommentInteractionArguments,
  CommentItemProps,
  CommentReply,
  CommentsSentSubscriptionData,
} from "../../../../util/types";
import { formatTimeToPost } from "../../../../util/functions";
import { CommentPopulated } from "../../../../../../backend/src/util/types";
import RecursiveCommentItem from "./_recursiveCommentItem";
import CommentInput from "./_commentInput";
import CommentInputEdit from "./_commentInputEdit";
import Link from "next/link";

const CommentItem: FC<CommentItemProps> = ({
  session,
  commentsData,
  complainItems,
  postId,
  isUser,
}: CommentItemProps) => {
  const [activeElem, setActiveElem] = useState(false);
  const [answerActive, setAnswerActive] = useState(false);

  const [editActive, setEditActive] = useState(false);
  const [contentEdit, setContentEdit] = useState("");

  const [commentData, setCommentData] =
    useState<CommentPopulated>(commentsData);

  const { id, author, likes, text, createdAt, isDeleted, replies } =
    commentData;

  const [comments, setComments] = useState<
    Comment[] | CommentReply | undefined
  >(replies as unknown as CommentReply[]);

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

  const [deleteComment] = useMutation<
    { deleteComment: CommentPopulated },
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

  const { data: newCommentData } =
    useSubscription<CommentsSentSubscriptionData>(
      CommentOperations.Subscriptions.commentsUpdated
    );

  useEffect(() => {
    if (newCommentData) {
      const newComment = newCommentData.commentsUpdated;
      const oldComments = comments;

      newComment &&
        oldComments &&
        newComment.parentId === id &&
        setComments([
          newComment as unknown as Comment,
          ...(oldComments as CommentReply[]),
        ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCommentData]);

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
        {session && author?.id === session.user.id && isDeleted !== true && (
          <div className="fafont-icon interactive edit">
            <FontAwesomeIcon
              icon={faPencil}
              style={{
                width: "100%",
                height: "100%",
                color: "inherit",
              }}
              onClick={(e) => {
                e.preventDefault();
                setContentEdit(JSON.parse(text));
                setEditActive(true);
              }}
            />
          </div>
        )}
        <Link href={`/author/${author.id}`} className="user-author">
          <div className="author">
            <div className="user-icon">
              {!isDeleted && author.image && (
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
                <p>{isDeleted ? "Ескапад автора" : author.username}</p>
              </div>
              <div className="time">
                <p> {" " + formatTimeToPost(createdAt)}</p>
              </div>
            </div>
          </div>
        </Link>
        {text && editActive ? (
          <CommentInputEdit
            session={session}
            id={id}
            authorId={author.id}
            content={contentEdit}
            setContent={setContentEdit}
            setCommentData={setCommentData}
            setEditActive={setEditActive}
          />
        ) : (
          returnMeContent(text)
        )}
        <div className="interactions">
          <div className="lt-side">
            {isUser !== true && (
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
            )}
            {session && author?.id !== session.user.id && (
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
            )}
            {isUser !== true && replies != undefined && replies && (
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
        {isUser !== true && answerActive && editActive != true && (
          <CommentInput postId={postId} session={session} parentId={id} />
        )}
      </div>
      {!isUser && replies !== undefined && replies.length > 0 && comments && (
        <div className="comments-to-item">
          {(comments as (CommentReply | Comment)[]).map((item, i: any) => (
            <RecursiveCommentItem
              key={`${item.id}__first__${i}`}
              session={session}
              commentsData={item as Comment}
              complainItems={complainItems}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
