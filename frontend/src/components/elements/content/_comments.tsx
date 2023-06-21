import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { CommentItem, CommentInput } from "./comments";

import { useQuery } from "@apollo/client";
import { Session } from "next-auth";
import CommentOperations from "../../../graphql/operations/comments";
import {
  CommentsByPostData,
  CommentsByUserData,
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
      variables: { postId: postId ? postId : "", take: 4, skip: 0 },
      skip: userId !== undefined || postId === undefined,
      onError: ({ message }) => {
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
      skip: userId === undefined || postId !== undefined,
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  const [onceLoaded, setOnceLoaded] = useState(false);
  const [comments, setComments] = useState<CommentPopulated[] | undefined>();

  useEffect(() => {
    if (onceLoaded != true && loading == false) {
      if (
        userId === undefined &&
        postId !== undefined &&
        commentArray?.queryPostComments
      ) {
        setComments(commentArray.queryPostComments);
        setPostCommentsCount &&
          setPostCommentsCount(commentArray.queryPostComments.length);
      } else if (
        userId !== undefined &&
        postId === undefined &&
        commentArrayUser?.queryUserComments
      ) {
        setComments(commentArrayUser.queryUserComments);
      } else {
        setComments([]);
      }
      setOnceLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded, setOnceLoaded]);

  const [hasMore, setHasMore] = useState(true);

  const getMoreComments = async () => {
    if (comments) {
      if (userId === undefined && postId !== undefined) {
        const newComments = await fetchMore({
          variables: {
            skip: comments.length,
            take: 3,
          },
        });

        if (newComments.data.queryPostComments.length === 0) {
          setHasMore(false);
          return null;
        }

        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...newComments.data.queryPostComments]
            : newComments.data.queryPostComments;
        });
      } else if (userId !== undefined && postId === undefined) {
        const newComments = await fetchMoreUserComments({
          variables: {
            skip: comments.length,
            take: 3,
          },
        });

        if (newComments.data.queryUserComments.length === 0) {
          setHasMore(false);
          return null;
        }

        setComments((prevComments) => {
          return prevComments
            ? [...prevComments, ...newComments.data.queryUserComments]
            : newComments.data.queryUserComments;
        });
      }
    }

    return [];
  };

  return loading || loadingUserComments ? (
    <div>Loading</div>
  ) : (
    <div id="comments" className="post-wrapper container">
      {userId === undefined && postId !== undefined && commentArray && (
        <div className="title">
          <h3>Коментарів</h3>
          <div className="count">
            <p>{commentArray.queryPostComments.length}</p>
          </div>
        </div>
      )}
      {userId === undefined && postId !== undefined && (
        <CommentInput session={session} postId={postId} />
      )}
      {comments && (
        <InfiniteScroll
          dataLength={comments.length}
          next={getMoreComments}
          hasMore={hasMore}
          loader={<p> Loading...</p>}
        >
          <div className="container comments-flow">
            {comments.map((item, i: number) => (
              <CommentItem
                key={`${item.id}__first__${i}`}
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
