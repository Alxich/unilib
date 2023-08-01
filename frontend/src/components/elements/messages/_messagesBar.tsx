import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

import { Session } from "next-auth";

import MessagesBarChatsWrapper from "./messages/_messagesBarChatWrapper";

interface MessagesBarProps {
  session: Session;
}

const MessagesBar: FC<MessagesBarProps> = ({ session }: MessagesBarProps) => {
  const router = useRouter();
  const isMessagesRoute = router.pathname.startsWith("/messages/chat");
  const isMessagesAllRoute = router.query.type === "all";
  const isMessagesUnreadRoute = router.query.type === "unread";
  const isMessagesMarkedRoute = router.query.type === "marked";

  return (
    <div id="messages-bar" className="container content-pad">
      {isMessagesRoute ? (
        <MessagesBarChatsWrapper session={session} />
      ) : (
        <>
          <div className="header default container full-width flex-row flex-space">
            <div className="title">
              <p>Вхідні листи</p>
            </div>
          </div>
          <div className="container full-width">
            <Link
              href={"/messages/all"}
              className={classNames("item bars", {
                active: isMessagesAllRoute,
              })}
            >
              <span className="title">Усі повідомлення</span>
              <span className="count">12</span>
            </Link>
            <Link
              href={"/messages/unread"}
              className={classNames("item bars", {
                active: isMessagesUnreadRoute,
              })}
            >
              <span className="title">Непрочитано</span>
              <span className="count">1</span>
            </Link>
            <Link
              href={"/messages/marked"}
              className={classNames("item bars", {
                active: isMessagesMarkedRoute,
              })}
            >
              <span className="title">Важливі повідомлення</span>
              <span className="count">0</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesBar;
