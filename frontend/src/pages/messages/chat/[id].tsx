import { FC } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { Conversation } from "../../../components";

interface MessagesChatProps {}

const MessagesChat: FC<NextPage> = (props: MessagesChatProps) => {
  const router = useRouter();
  const conversationId = router.query.id;

  const { data: session } = useSession();

  return (
    <div id="messages">
      {session && conversationId && typeof conversationId === "string" && (
        <Conversation conversationId={conversationId} session={session} />
      )}
    </div>
  );
};

export default MessagesChat;
