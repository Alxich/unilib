import { FC, useEffect, useState } from "react";
import Image from "next/image";
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
import CommentInput from "./_commentInput";

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import CommentOperations from "../../../../graphql/operations/comments";
import {
  CommentInteractionArguments,
  CommentsByCommentData,
  CommentsSentSubscriptionData,
  QueryCommentsByCommentArgs,
  Comment,
} from "../../../../util/types";
import { CommentPopulated } from "../../../../../../backend/src/util/types";
import CommentInputEdit from "./_commentInputEdit";

import { formatTimeToPost } from "../../../../util/functions";
import ReturnMeContent from "../../../../util/functions/returnMeContent";

interface RecursiveCommentItemProps {
  session: any;
  commentsData: Comment | CommentPopulated;
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
  const [answerShowActive, setAnswerShowActive] = useState(false);

  const [editActive, setEditActive] = useState(false);
  const [contentEdit, setContentEdit] = useState("");

  const [commentData, setCommentData] = useState<CommentPopulated>(
    commentsData as CommentPopulated
  );

  const { id, author, likes, text, createdAt, isDeleted } = commentData;

  const [comments, setComments] = useState<CommentPopulated[] | undefined>();

  // Query hook to fetch comments related to a specific comment.
  const { data: commentArray, loading } = useQuery<
    CommentsByCommentData,
    QueryCommentsByCommentArgs
  >(CommentOperations.Queries.queryCommentsByComment, {
    variables: { commentId: id },
    // skip: answerShowActive !== true, // Optionally skip the query based on a condition
    // This function is executed when the query is successfully completed.
    onCompleted: (commentArray) => {
      if (commentArray.queryCommentsByComment) {
        // Update the component's state or trigger a refetch to update the data
        // with the fetched comments related to the given comment.
        setComments(commentArray.queryCommentsByComment);
      } else {
        // If no comments were fetched, set an empty array.
        setComments([]);
      }
    },
    // This function is executed if an error occurs during the query.
    onError: ({ message }) => {
      console.error(message);
    },
  });

  // Hook to set up a mutation for adding a like to a comment.
  const [addLikeToComment] = useMutation<
    { addLikeToComment: CommentPopulated },
    CommentInteractionArguments
  >(CommentOperations.Mutations.addLikeToComment, {
    // This function is executed if an error occurs during the mutation.
    onError: (error) => {
      console.error("addLikeToComment error", error);
      // Display an error toast message to the user.
      toast.error("An error occurred while liking the comment");
    },
    // This function is executed when the mutation is successfully completed.
    onCompleted: (data) => {
      // If data.addLikeToComment is truthy, indicating a successful like.
      if (data.addLikeToComment) {
        // Update the component's state or trigger a refetch to update the data
        // with the newly liked comment data.
        setCommentData(data.addLikeToComment);

        // Display a success toast message to the user.
        toast.success("Comment was liked!");
      } else {
        // If data.addLikeToComment is falsy, indicating a failed like.
        // Display an error toast message to the user.
        toast.error("Failed to like the comment");
      }
    },
  });

  // Mutation hook to add a dislike to a comment.
  const [addDislikeToComment] = useMutation<
    { addDislikeToComment: CommentPopulated },
    CommentInteractionArguments
  >(CommentOperations.Mutations.addDislikeToComment, {
    // This function is executed if an error occurs during the mutation.
    onError: (error) => {
      console.error("addDislikeToComment error", error);
      toast.error("Error occurred while disliking the comment");
    },
    // This function is executed when the mutation is successfully completed.
    onCompleted: (data) => {
      if (data.addDislikeToComment) {
        // Update the component's state or trigger a refetch to update the data
        // with the newly disliked comment data.
        setCommentData(data.addDislikeToComment);

        toast.success("Comment was disliked!");
      } else {
        toast.error("Failed to dislike the comment");
      }
    },
  });

  // Mutation hook to delete a comment.
  const [deleteComment] = useMutation<
    { deleteComment: CommentPopulated },
    CommentInteractionArguments
  >(CommentOperations.Mutations.deleteComment, {
    // This function is executed if an error occurs during the mutation.
    onError: (error) => {
      console.error("deleteComment error", error);
      toast.error("Error occurred while deleting the comment");
    },
    // This function is executed when the mutation is successfully completed.
    onCompleted: (data) => {
      if (data.deleteComment) {
        // Update the component's state or trigger a refetch to update the data
        // with the comment data after deletion.
        setCommentData(data.deleteComment);

        toast.success("Comment was deleted!");
      } else {
        toast.error("Failed to delete the comment");
      }
    },
  });

  // Function to handle interactions (liking/disliking) with a comment.
  const onCommentInteraction = async (type: boolean) => {
    /**
     * If type is true, it means we want to like the comment.
     * If type is false, it means we want to dislike the comment.
     */
    try {
      // Check if the user session is available
      if (!session) {
        throw new Error("Not authorized Session");
      }

      // Extract the username from the user session
      const { username } = session.user;

      // Check if the user's username exists for comment security
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Handle like action
      if (type !== false) {
        const { data, errors } = await addLikeToComment({
          variables: {
            id: id, // Comment ID
          },
        });

        // Check for errors during the like action
        if (!data?.addLikeToComment || errors) {
          throw new Error("Error onLikeComment when trying to like");
        }

        // Display success message after successful like
        if (!errors) {
          toast.success("Comment was liked!");
        }
      }
      // Handle dislike action
      else {
        const { data, errors } = await addDislikeToComment({
          variables: {
            id: id, // Comment ID
          },
        });

        // Check for errors during the dislike action
        if (!data?.addDislikeToComment || errors) {
          throw new Error("Error addDislikeToComment when trying to dislike");
        }

        // Display success message after successful dislike
        if (!errors) {
          toast.success("Comment was disliked!");
        }
      }
    } catch (error: any) {
      // Log and display error message in case of any exception
      console.error("onCommentInteraction error", error);
      toast.error(error?.message);
    }
  };

  // Function to handle the deletion of a comment by its author.
  const onDeleteComment = async () => {
    /**
     * This function allows the author to delete a comment.
     * Instead of actually deleting the comment, it changes the content.
     */
    try {
      // Check if the user session is available
      if (!session) {
        throw new Error("Not authorized Session");
      }

      // Extract the username from the user session
      const { username } = session.user;

      // Check if the user's username exists for comment security
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if the author's ID matches the user's ID
      if (author.id !== session?.user.id) {
        throw new Error("You are not the author!");
      }

      // Delete the comment using the deleteComment mutation
      const { data, errors } = await deleteComment({
        variables: {
          id: id, // Comment ID
        },
      });

      // Check for errors during the deletion process
      if (!data?.deleteComment || errors) {
        throw new Error("Error onDeleteComment when trying to delete");
      }

      // Display success message after successful deletion
      if (!errors) {
        toast.success("Comment was deleted!");
      }
    } catch (error: any) {
      // Log and display error message in case of any exception
      console.error("onDeleteComment error", error);
      toast.error(error?.message);
    }
  };

  // Subscription to receive new comment data
  const { data: newCommentData } =
    useSubscription<CommentsSentSubscriptionData>(
      CommentOperations.Subscriptions.commentsUpdated
    );

  // Effect to update comments when newCommentData is received
  useEffect(() => {
    // Check if there's new comment data
    if (newCommentData) {
      // Extract the new comment from newCommentData
      const newComment = newCommentData.commentsUpdated;

      // Get the existing comments
      const oldComments = comments;

      // Check if the new comment belongs to the same parent as the current context
      if (newComment && oldComments && newComment.parentId === id) {
        // Append the new comment to the existing comments
        setComments([...oldComments, newComment]);
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
            {comments != undefined && comments && (
              <div
                className="answer-count"
                onClick={() =>
                  setAnswerShowActive(answerShowActive ? false : true)
                }
              >
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
        {answerActive && (
          <CommentInput
            postId={postId}
            session={session}
            parentId={id}
            setAnswerShowActive={setAnswerShowActive}
            // subscribeToMoreComments={subscribeToMoreComments}
          />
        )}
      </div>

      {loading != true && answerShowActive && comments && (
        <div className="comments-to-item">
          {comments.map((item, i: number) => (
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
