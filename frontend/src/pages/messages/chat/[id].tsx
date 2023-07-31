import { FC } from "react";
import { NextPage } from "next";

import { Conversation } from "../../../components";

type MessagesChatProps = {};

const MessagesChat: FC<NextPage> = (props: MessagesChatProps) => {
  return (
    <div id="messages">
      <Conversation />
    </div>
  );
};

export default MessagesChat;
