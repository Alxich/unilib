import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { generateHTML } from "@tiptap/react";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

import { useQuery, useSubscription } from "@apollo/client";
import CommentOperations from "../graphql/operations/comments";
import { CommentPopulated } from "../../../backend/src/util/types";
import { CommentsData, CommentsSubscriptionData } from "../util/types";
import { Session } from "inspector";

interface ReelsProps {
  session: Session | null;
}

const Reels: FC = () => {
  const [commentsData, setCommentsData] = useState<
    CommentPopulated[] | undefined
  >();

  const {
    data: reelsArray,
    loading,
    subscribeToMore,
  } = useQuery<CommentsData>(CommentOperations.Queries.queryComments, {
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
  });

  const { data: newCommentData } = useSubscription<CommentsSubscriptionData>(
    CommentOperations.Subscriptions.commentsUpdated
  );

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

  interface types {
    author: {
      image: string | null;
      id: string;
      username: string | null;
    };
    post: {
      id: string;
      title: string;
    };
    text: string;
  }

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, TiptapImage]);

    return (
      <div className="text-block" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  const ReturnReel = ({ author, post, text }: types) => {
    return (
      <Link href={`/post/${post.id}`} className="item container flex-left">
        <div className="author-thread container flex-left flex-row">
          <div className="icon">
            {author?.image && (
              <Image
                src={author.image}
                height={1080}
                width={1920}
                alt="author-background"
              />
            )}
          </div>
          <div className="info container flex-left">
            <div className="nickname">
              <p>{author.username}</p>
            </div>
            <div className="thematic">
              <p>{post.title}</p>
            </div>
          </div>
        </div>
        {returnMeContent(text)}
      </Link>
    );
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="reels" className="container flex-left to-right full-height">
      <div className="title">
        <p>Наразі обговорюють</p>
      </div>
      <div className="container flex-left">
        {commentsData?.map((item: CommentPopulated, i: number) => {
          const { author, post, text } = item;
          return (
            <ReturnReel
              key={`${item.id}__${i}`}
              author={author}
              post={post}
              text={text}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Reels;
