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
      skip: userId !== undefined && postId === undefined,
      onCompleted(data) {
        setComments(data.queryPostComments);
      },
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  console.log(postId);

  const {
    data: commentArrayUser,
    loading: loadingUserComments,
    fetchMore: fetchMoreUserComments,
  } = useQuery<CommentsByUserData, QueryUserCommentsArgs>(
    CommentOperations.Queries.queryUserComments,
    {
      variables: { userId: userId ? userId : "", take: 4, skip: 0 },
      skip: userId !== undefined && postId !== undefined,
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

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
        !newComment.parentId &&
        setComments([...oldComments, newComment]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCommentData]);

  useEffect(() => {
    if (onceLoaded !== true && loading !== true) {
      if (userId !== undefined && postId !== undefined && commentArray) {
        setComments(commentArray.queryPostComments);
        setPostCommentsCount &&
          setPostCommentsCount(commentArray.queryPostComments.length);
        setOnceLoaded(true);
      } else if (
        userId !== undefined &&
        postId === undefined &&
        commentArrayUser
      ) {
        setComments(commentArrayUser.queryUserComments);
        setOnceLoaded(true);
      } else {
        setComments([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded]);

  const [hasMore, setHasMore] = useState(true);

  const getMoreComments = async () => {
    if (comments) {
      if (userId !== undefined && postId !== undefined) {
        const { data } = await fetchMore({
          variables: {
            skip: comments.length,
            take: 3,
          },
        });

        if (data.queryPostComments.length === 0) {
          setHasMore(false);
          return null;
        }

        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...data.queryPostComments]
            : data.queryPostComments;
        });
      } else if (userId !== undefined && postId === undefined) {
        const { data } = await fetchMoreUserComments({
          variables: {
            skip: comments.length,
            take: 3,
          },
        });

        if (data.queryUserComments.length === 0) {
          setHasMore(false);
          return null;
        }

        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...data.queryUserComments]
            : data.queryUserComments;
        });
      }
    }

    return [];
  };

  console.log(comments);

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
        <CommentInput
          session={session}
          postId={postId}
          // subscribeToMoreComments={subscribeToMoreComments}
        />
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
                // subscribeToMoreComments={subscribeToMoreComments}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Comments;
