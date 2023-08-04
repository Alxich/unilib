import { FC } from "react";
import Link from "next/link";

import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import { ConversationPopulated } from "../../../../../../backend/src/util/types";
import { formatTimeToPost, formatUsernames } from "../../../../util/functions";

interface MessagesItemProps {
  onClick: () => void;
  userId: string;
  hasSeenLatestMessage: boolean;
  data: ConversationPopulated;
}

const MessagesItem: FC<MessagesItemProps> = ({
  userId,
  hasSeenLatestMessage,
  data,
}: MessagesItemProps) => {
  const { id, latestMessage, participants, updatedAt } = data;
  const messageBody = latestMessage?.body;

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return (
      <div className="text" dangerouslySetInnerHTML={{ __html: html }}></div>
    );
  };

  return (
    <Link href={`/messages/chat/${id}`} className="item">
      <div className="user-icon"></div>
      <div className="container full-width">
        <div className="user-titles">
          <div className="username">
            <p>{formatUsernames(participants, userId)}</p>
          </div>
          <div className="time">
            <p>{formatTimeToPost(updatedAt)}</p>
          </div>
        </div>
        <div className="information">
          {messageBody ? (
            returnMeContent(messageBody)
          ) : (
            <p>Поки що цей чат порожній</p>
          )}

          {!hasSeenLatestMessage && <p className="counter"></p>}
        </div>
      </div>
    </Link>
  );
};

export default MessagesItem;
