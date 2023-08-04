import { FC } from "react";
import { useRouter } from "next/router";

import { Session } from "next-auth";

import MessagesBarChatsWrapper from "./messages/_messagesBarChatWrapper";

import MessagesBarFilterItems from "./messages/_messagesBarFilterItems";

interface MessagesBarProps {
  session: Session;
}

const MessagesBar: FC<MessagesBarProps> = ({ session }: MessagesBarProps) => {
  const router = useRouter();
  const isMessagesRoute = router.pathname.startsWith("/messages/chat");

  return (
    <div id="messages-bar" className="container content-pad">
      {isMessagesRoute ? (
        <MessagesBarChatsWrapper session={session} />
      ) : (
        <MessagesBarFilterItems session={session} />
      )}
    </div>
  );
};

export default MessagesBar;
