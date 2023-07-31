import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

interface MessagesBarProps {}

const MessagesBar: FC<MessagesBarProps> = (props: MessagesBarProps) => {
  const router = useRouter();
  const isMessagesRoute = router.pathname.startsWith("/messages/chat");
  const isMessagesAllRoute = router.query.type === "all";
  const isMessagesUnreadRoute = router.query.type === "unread";
  const isMessagesMarkedRoute = router.query.type === "marked";

  console.log(isMessagesRoute);

  return (
    <div id="messages-bar" className="container content-pad">
      {isMessagesRoute ? (
        <>
          <div className="header messages container full-width flex-row flex-space">
            <div className="title">
              <p>Усі повідомлення</p>
            </div>
            <Link href={"/messages/all"}>Показати усі</Link>
          </div>
          <div className="container full-width">
            <Link href={"/messages/chat/1"} className="item message active">
              <div className="user-icon"></div>
              <div className="container full-width">
                <div className="user-titles">
                  <div className="username">
                    <p>Кирило Туров</p>
                  </div>
                  <div className="time">
                    <p>12:31</p>
                  </div>
                </div>
                <div className="information">
                  <p>Привіт! Як у тебе справи ?</p>
                  <p className="counter">6</p>
                </div>
              </div>
            </Link>
            <Link href={"/messages/chat/2"} className="item message">
              <div className="user-icon"></div>
              <div className="container full-width">
                <div className="user-titles">
                  <div className="username">
                    <p>Кирило Туров</p>
                  </div>
                  <div className="time">
                    <p>12:31</p>
                  </div>
                </div>
                <div className="information">
                  <p>У цьому прикладі ми застосовуємо стилі до всіх тегів</p>
                  <p className="counter">6</p>
                </div>
              </div>
            </Link>
          </div>
        </>
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
