import { FC } from "react";
import Link from "next/link";
import classNames from "classnames";

import { ConversationPopulated } from "../../../../../../backend/src/util/types";
import { formatTimeToPost, formatUsernames } from "../../../../util/functions";
import ReturnMeContent from "../../../../util/functions/returnMeContent";

interface MessagesBarChatItemProps {
  onClick: () => void;
  userId: string;
  hasSeenLatestMessage: boolean;
  currentChat: boolean;
  data: ConversationPopulated;
}

const MessagesBarChatItem: FC<MessagesBarChatItemProps> = ({
  userId,
  hasSeenLatestMessage,
  currentChat,
  data,
}: MessagesBarChatItemProps) => {
  const { id, latestMessage, participants, updatedAt } = data;
  const messageBody = latestMessage?.body;

  return (
    <Link
      href={`/messages/chat/${id}`}
      className={classNames("item message", {
        active: currentChat,
      })}
    >
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
            <ReturnMeContent className="text" content={messageBody} />
          ) : (
            <p>Поки що цей чат порожній</p>
          )}

          {!hasSeenLatestMessage && <p className="counter"></p>}
        </div>
      </div>
    </Link>
  );
};

export default MessagesBarChatItem;
