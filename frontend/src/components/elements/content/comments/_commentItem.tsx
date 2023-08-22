import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

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

import { CommentPopulated } from "../../../../../../backend/src/util/types";
import RecursiveCommentItem from "./_recursiveCommentItem";
import CommentInput from "./_commentInput";
import CommentInputEdit from "./_commentInputEdit";

import { formatTimeToPost } from "../../../../util/functions";
import ReturnMeContent from "../../../../util/functions/returnMeContent";

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

  const { id, author, likes, dislikes, text, createdAt, isDeleted, replies } =
    commentData;

  const [comments, setComments] = useState<
    Comment[] | CommentReply[] | undefined
  >(replies as unknown as CommentReply[]);

  // Mutation to add a like to a comment
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

  // Mutation to add a dislike to a comment
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

  // Function to handle liking or disliking a comment
  const onCommentInteraction = async (type: boolean) => {
    try {
      // Check if the user is authenticated
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if the user's information is available
      if (!username) {
        throw new Error("Not authorized user");
      }

      if (type !== false) {
        // If true, like the comment
        const { data, errors } = await addLikeToComment({
          variables: {
            id: id, // ID of the comment
          },
        });

        if (!data?.addLikeToComment || errors) {
          throw new Error("Error onLikeComment when trying to like");
        }

        if (!errors) {
          toast.success("Comment was liked!");
        }
      } else {
        // If false, dislike the comment
        const { data, errors } = await addDislikeToComment({
          variables: {
            id: id, // ID of the comment
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

  // Mutation to delete a comment
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

  // Function to delete a comment
  const onDeleteComment = async () => {
    /**
     * This func allow author to delete a comment
     * It will not delete at all but change the content
     */
    try {
      // Check if user is authenticated
      if (!session) {
        throw new Error("Not authorized Session");
      }

      // Get the username from the user's session
      const { username } = session.user;

      // Check if username exists to ensure secure comment deletion
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if the logged-in user is the author of the comment
      if (author.id !== session?.user.id) {
        throw new Error("You are not the author!");
      }

      // Delete the comment using the deleteComment mutation
      const { data, errors } = await deleteComment({
        variables: {
          id: id,
        },
      });

      // Handle errors during comment deletion
      if (!data?.deleteComment || errors) {
        throw new Error("Error onDeleteComment when trying to delete");
      }

      // Display a success toast message upon successful comment deletion
      if (!errors) {
        toast.success("Comment was deleted!");
      }
    } catch (error: any) {
      // Log and display any errors that occur during comment deletion
      console.error("onDeleteComment error", error);
      toast.error(error?.message);
    }
  };

  // Subscribe to new comment updates using a subscription
  const { data: newCommentData } =
    useSubscription<CommentsSentSubscriptionData>(
      CommentOperations.Subscriptions.commentsUpdated
    );

  // Update comments when a new comment is received through the subscription
  useEffect(() => {
    if (newCommentData) {
      // Extract the new comment from the subscription data
      const newComment = newCommentData.commentsUpdated;

      // Get the existing comments
      const oldComments = comments;

      // Check if there are existing comments
      if (oldComments) {
        // If the new comment is a reply to the current comment (parentId matches),
        // append it to the existing replies
        if (newComment && newComment.parentId === id) {
          setComments([
            ...(oldComments as CommentReply[]),
            newComment as unknown as Comment,
          ]);
        }
      } else {
        // If there are no existing comments, create a new array with the new comment
        setComments([newComment as unknown as Comment]);
      }
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
          <ReturnMeContent className="content" content={text} />
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
            {isUser !== true && comments != undefined && comments && (
              <div className="answer-count">
                <p>{comments.length} Відповідь</p>
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
      {!isUser && comments ? (
        <div className="comments-to-item">
          {(comments as (CommentReply | Comment)[]).map((item, i: any) => (
            <RecursiveCommentItem
              key={`${item.id}__first__${i}`}
              session={session}
              commentsData={item as Comment}
              complainItems={complainItems}
              postId={postId}
            />
          ))}{" "}
        </div>
      ) : (
        replies !== undefined &&
        replies.length > 0 && (
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
        )
      )}
    </div>
  );
};

export default CommentItem;
