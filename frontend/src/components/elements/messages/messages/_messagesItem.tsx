import Link from "next/link";
import React from "react";

interface MessagesItemProps {}

const MessagesItem = (props: MessagesItemProps) => {
  return (
    <Link href={"/messages/chat/1"} className="item">
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
  );
};

export default MessagesItem;
