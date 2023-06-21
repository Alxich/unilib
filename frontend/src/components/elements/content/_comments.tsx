import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { CommentItem, CommentInput } from "./comments";

import { useQuery } from "@apollo/client";
import { Session } from "next-auth";
import CommentOperations from "../../../graphql/operations/comments";
import { CommentsByPostData, QueryPostCommentsArgs } from "../../../util/types";
import { CommentPopulated } from "../../../../../backend/src/util/types";

interface CommentsProps {
  session: Session;
  postId: string;
  setPostCommentsCount: Dispatch<SetStateAction<number | undefined>>;
}

const Comments: FC<CommentsProps> = ({
  session,
  postId,
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
      variables: { postId, take: 4, skip: 0 },
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  const [onceLoaded, setOnceLoaded] = useState(false);
  const [comments, setComments] = useState<CommentPopulated[] | undefined>();

  useEffect(() => {
    if (onceLoaded != true && loading == false) {
      if (commentArray?.queryPostComments) {
        setComments(commentArray.queryPostComments);
        setPostCommentsCount(commentArray.queryPostComments.length);
      }
      setOnceLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onceLoaded, setOnceLoaded]);

  const [hasMore, setHasMore] = useState(true);

  const getMoreComments = async () => {
    if (comments) {
      const newComments = await fetchMore({
        variables: {
          skip: comments.length,
          take: 1,
        },
      });

      if (newComments.data.queryPostComments.length === 0) {
        setHasMore(false);
        return null;
      }

      setComments((comment) => {
        return (
          comment &&
          newComments && [...comment, ...newComments.data.queryPostComments]
        );
      });
    }

    return [];
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="comments" className="post-wrapper container">
      {commentArray && (
        <div className="title">
          <h3>Коментарів</h3>
          <div className="count">
            <p>{commentArray.queryPostComments.length}</p>
          </div>
        </div>
      )}
      <CommentInput session={session} postId={postId} />
      {commentArray && comments && (
        <InfiniteScroll
          dataLength={comments.length}
          next={getMoreComments}
          hasMore={hasMore}
          loader={<h3> Loading...</h3>}
          endMessage={<h4>Nothing more to show</h4>}
        >
          <div className="container comments-flow">
            {commentArray.queryPostComments.map((item, i: number) => (
              <CommentItem
                key={`${item.id}__first__${i}`}
                session={session}
                commentsData={item}
                complainItems={complainItems}
                postId={postId}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Comments;
