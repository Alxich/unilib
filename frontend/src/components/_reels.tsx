import { FC, useEffect, useState } from "react";

import { ReelsItem } from "./elements/reel";

import { useQuery, useSubscription } from "@apollo/client";
import CommentOperations from "../graphql/operations/comments";
import { CommentPopulated } from "../../../backend/src/util/types";
import { CommentsData, CommentsSubscriptionData } from "../util/types";
import { ReelsItemLoading } from "./skeletons";

interface ReelsProps {}
const Reels: FC<ReelsProps> = ({}: ReelsProps) => {
  const [commentsData, setCommentsData] = useState<
    CommentPopulated[] | undefined
  >();

  // Querying first 5 comment and set to state

  const { data: reelsArray, loading } = useQuery<CommentsData>(
    CommentOperations.Queries.queryComments,
    {
      variables: {
        take: 5,
      },
      onCompleted: (commentArray) => {
        if (commentArray.queryComments) {
          // Update the component's state or trigger a refetch to update the data
          setCommentsData(commentArray.queryComments);
        } else {
          setCommentsData([]);
        }
      },
      onError: ({ message }) => {
        console.error(message);
      },
    }
  );

  // Using subscription to get every new comment

  const { data: newCommentData } = useSubscription<CommentsSubscriptionData>(
    CommentOperations.Subscriptions.commentsUpdated
  );

  /**
   * Stacking new comments to our reels
   * It will shows up like new comment on top
   * but on restart it will show last 5
   */

  useEffect(() => {
    const newComment = newCommentData?.commentsUpdated;

    if (newComment) {
      setCommentsData((prevCommentReplies) => {
        if (prevCommentReplies) {
          return [newComment, ...prevCommentReplies];
        } else {
          return [newComment];
        }
      });
    }
  }, [newCommentData]);

  return (
    <div id="reels" className="container flex-left to-right full-height">
      <div className="title">
        <p>Наразі обговорюють</p>
      </div>
      <div className="container flex-left">
        {loading ? (
          <>
            <ReelsItemLoading />
            <ReelsItemLoading />
            <ReelsItemLoading />
            <ReelsItemLoading />
            <ReelsItemLoading />
          </>
        ) : (
          commentsData?.map((item: CommentPopulated, i: number) => {
            const { author, post, text } = item;
            return (
              <ReelsItem
                key={`${item.id}__${i}`}
                author={author}
                post={post}
                text={text}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Reels;
