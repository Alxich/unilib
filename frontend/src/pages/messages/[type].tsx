import { FC } from "react";
import { NextPage } from "next";
import { Messages } from "../../components";

type MessagesPageProps = {};

const MessagesPage: FC<NextPage> = (props: MessagesPageProps) => {
  return (
    <div id="messages">
      <Messages />
    </div>
  );
};

export default MessagesPage;
