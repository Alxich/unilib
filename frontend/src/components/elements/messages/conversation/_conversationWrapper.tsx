import { FC, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import OhfailPage from "../_ohfailpage";

import { useQuery } from "@apollo/client";
import MessageOperations from "../../../../graphql/operations/messages";
import {
  MessagesData,
  MessagesSubscriptionData,
  MessagesVariables,
} from "../../../../util/types";
import { formatTimeToPost } from "../../../../util/functions";

import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import wizzardBorisCat from "../../../../../public/images/boris-wizzard.png";
import classNames from "classnames";

interface ConversationWrapperProps {
  userId: string;
  conversationId: string;
}

const ConversationWrapper: FC<ConversationWrapperProps> = ({
  userId,
  conversationId,
}: ConversationWrapperProps) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (!messagesEndRef.current || !data) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, messagesEndRef.current]);

  const returnMeContent = (str: string) => {
    const html = generateHTML(JSON.parse(str), [StarterKit, Image]);

    return (
      <div className="text" dangerouslySetInnerHTML={{ __html: html }}></div>
    );
  };

  if (error) {
    return null;
  }

  return (
    <div className="conversation-wrapper">
      {data?.messages ? (
        data.messages.map((item, i) => (
          <div
            className={classNames("item", {
              sender: item.sender.id !== userId,
              author: item.sender.id === userId,
            })}
            key={`${item}__${i}`}
          >
            {returnMeContent(item.body)}
            <p className="time">{formatTimeToPost(item.createdAt)}</p>
            <div className="triangle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
              >
                <path
                  d="M13.151 7.42547C14.4092 8.4122 14.0581 10.4033 12.5383 10.9002L3.105 13.9843C1.66944 14.4536 0.25162 13.2234 0.513886 11.736L2.1376 2.52749C2.39986 1.04011 4.15294 0.368995 5.34141 1.30101L13.151 7.42547Z"
                  fill="#3A3A3A"
                />
              </svg>
            </div>
          </div>
        ))
      ) : (
        <OhfailPage
          image={wizzardBorisCat}
          text="У вас ще немає повідомлень з цим користувачем. Якщо ви маєте бажання розмовляти з цим співрозмовником то скоріш доведеться вам самостійно написати йому першим : )"
        />
      )}
    </div>
  );
};

export default ConversationWrapper;
