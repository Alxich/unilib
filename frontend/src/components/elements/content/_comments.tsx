import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { CommentItem, CommentInput } from "./comments";

import { useQuery, useSubscription } from "@apollo/client";
import { Session } from "next-auth";
import CommentOperations from "../../../graphql/operations/comments";
import {
  CommentsByPostData,
  CommentsByUserData,
  CommentsSentSubscriptionData,
  QueryPostCommentsArgs,
  QueryUserCommentsArgs,
} from "../../../util/types";
import { CommentPopulated } from "../../../../../backend/src/util/types";

interface CommentsProps {
  session: Session;
  postId?: string;
  userId: string;
  setPostCommentsCount?: Dispatch<SetStateAction<number | undefined>>;
}

const Comments: FC<CommentsProps> = ({
  session,
  postId,
  userId,
  setPostCommentsCount,
}: CommentsProps) => {
  const [onceLoaded, setOnceLoaded] = useState(false);
  const [comments, setComments] = useState<CommentPopulated[] | undefined>();

  const complainItems = [
    {
      title: "Скарга за копірайт",
      text: "Якщо цей автор скопіював ваш коментар чи пост.",
    },
    {
      title: "Скарга за контент",
      text: "Якщо цей автор поширує невідповідний контент як NSFW і тд.",
    },
    {
      title: "Скарга на лексику",
      text: "Якщо автор використовує ненормативну лексику (Не у тему чи у вашу сторону).",
    },
    {
      title: "Домагання чи будь-що що може вам нашкодити",
      text: "Автор вам погрожує чи дає натяки на насилля над вами.",
    },
  ];

  const {
    data: commentArray,
    loading,
    fetchMore,
  } = useQuery<CommentsByPostData, QueryPostCommentsArgs>(
    CommentOperations.Queries.queryPostComments,
    {
      variables: { postId: postId ? postId : "" },
      skip: userId !== undefined && postId === undefined, // Skip the query if certain conditions are met
      onCompleted(data) {
        // Update the state with fetched comments
        setComments(data.queryPostComments);
      },
      onError: ({ message }) => {
        // Handle errors that occur during the query
        console.error(message);
      },
    }
  );

  const {
    data: commentArrayUser,
    loading: loadingUserComments,
    fetchMore: fetchMoreUserComments,
  } = useQuery<CommentsByUserData, QueryUserCommentsArgs>(
    CommentOperations.Queries.queryUserComments,
    {
      variables: { userId: userId ? userId : "", take: 4, skip: 0 },
      skip: userId !== undefined && postId !== undefined, // Skip the query under specific conditions
      onError: ({ message }) => {
        // Handle errors that occur during the query
        console.error(message);
      },
    }
  );

  // Subscription to new comment updates

  const { data: newCommentData } =
    useSubscription<CommentsSentSubscriptionData>(
      CommentOperations.Subscriptions.commentsUpdated
    );

  useEffect(() => {
    if (newCommentData) {
      // New comment from the subscription
      const newComment = newCommentData.commentsUpdated;
      const oldComments = comments; // Existing comments in the component state

      // Check conditions and update the comments array
      newComment &&
        oldComments &&
        !newComment.parentId && // Exclude child comments for this update
        setComments([...oldComments, newComment]); // Add the new comment to the existing comments array
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCommentData]);

  useEffect(() => {
    if (onceLoaded !== true && loading !== true) {
      // When the component is not already loaded and not in a loading state

      if (userId !== undefined && postId !== undefined && commentArray) {
        // If viewing a post's comments

        // Set the comments based on the queried post comments
        setComments(commentArray.queryPostComments);
        setPostCommentsCount &&
          setPostCommentsCount(commentArray.queryPostComments.length); // Optionally update the post comments count

        // Mark that the component has been loaded
        setOnceLoaded(true);
      } else if (
        userId !== undefined &&
        postId === undefined &&
        commentArrayUser
      ) {
        // If viewing a user's comments
        // Set the comments based on the queried user comments
        setComments(commentArrayUser.queryUserComments);

        // Mark that the component has been loaded
        setOnceLoaded(true);
      } else {
        // No relevant comments, set comments to an empty array
        setComments([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded]);

  const [hasMore, setHasMore] = useState(true);

  const getMoreComments = async () => {
    if (comments) {
      // Only proceed if there are already existing comments

      if (userId !== undefined && postId !== undefined) {
        // If viewing a post's comments
        const { data } = await fetchMore({
          variables: {
            skip: comments.length, // Specify how many comments to skip (based on the current number of comments)
            take: 3, // Specify how many new comments to fetch
          },
        });

        if (data.queryPostComments.length === 0) {
          // If there are no more comments to fetch, set hasMore to false
          setHasMore(false);
          return null;
        }

        // Append the fetched comments to the existing comments array
        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...data.queryPostComments]
            : data.queryPostComments;
        });
      } else if (userId !== undefined && postId === undefined) {
        // If viewing a user's comments
        const { data } = await fetchMoreUserComments({
          variables: {
            skip: comments.length,
            take: 3,
          },
        });

        // if there is no enough data to show
        // set hasMore to false to block more querying
        if (data.queryUserComments.length === 0) {
          setHasMore(false);
          return null;
        }

        // if there is data - we push new after old data
        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...data.queryUserComments]
            : data.queryUserComments;
        });
      }
    }

    return [];
  };

  return loading === true || loadingUserComments === true ? (
    <div>Loading</div>
  ) : (
    <div id="comments" className="post-wrapper container">
      {/* Render comments from commentArray */}
      {userId !== undefined && postId !== undefined && commentArray && (
        <div className="title">
          <h3>Коментарів</h3>
          <div className="count">
            <p>{commentArray.queryPostComments.length}</p>
          </div>
        </div>
      )}

      {/* Render comments from commentArrayUser */}
      {userId !== undefined && postId === undefined && commentArrayUser && (
        <div className="title">
          <h3>Коментарів</h3>
          <div className="count">
            <p>{commentArrayUser.queryUserComments.length}</p>
          </div>
        </div>
      )}

      {userId !== undefined && postId !== undefined && (
        <CommentInput session={session} postId={postId} />
      )}

      {comments && (
        <InfiniteScroll
          dataLength={comments.length}
          next={getMoreComments}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
          key={comments.map((item) => item.id).join("-")} // Unique key for comments array
        >
          <div className="container comments-flow">
            {comments.map((item, i: number) => (
              <CommentItem
                key={`${item.id}__first__${i}`} // Unique key for each comment item
                session={session}
                commentsData={item}
                complainItems={complainItems}
                postId={postId}
                isUser={userId !== undefined && postId === undefined}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Comments;
