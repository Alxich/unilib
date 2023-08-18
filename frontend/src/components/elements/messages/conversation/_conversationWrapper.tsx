import { FC, useEffect, useRef, useState } from "react";
import toast from "react-toastify";
import classNames from "classnames";

import OhfailPage from "../_ohfailpage";

import { useQuery } from "@apollo/client";
import MessageOperations from "../../../../graphql/operations/messages";
import {
  MessagesData,
  MessagesSubscriptionData,
  MessagesVariables,
} from "../../../../util/types";

import { formatTimeToPost } from "../../../../util/functions";
import ReturnMeContent from "../../../../util/functions/returnMeContent";

import wizzardBorisCat from "../../../../../public/images/boris-wizzard.png";

interface ConversationWrapperProps {
  userId: string;
  conversationId: string;
}

const ConversationWrapper: FC<ConversationWrapperProps> = ({
  userId,
  conversationId,
}: ConversationWrapperProps) => {
  const [isBlackThemed, setIsBlackThemed] = useState<boolean>(true);

  // Fetch messages using a GraphQL query
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

  // Create a reference to the end of the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to new messages in a conversation
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
              ? prev.messages // If the sender is the current user, no change is needed
              : [newMessage, ...prev.messages], // Otherwise, add the new message to the list
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

  useEffect(() => {
    // '0' to assign the first (and only `HTML` tag)
    const root = document.getElementsByTagName("html")[0];

    const checkClass = () => {
      const isBlack = root.classList.value !== "black-themed";
      setIsBlackThemed(!isBlack);

      return isBlack;
    };

    const observer = new MutationObserver(checkClass);
    observer.observe(root, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (error) {
    return null;
  }

  return (
    <div className="conversation-wrapper">
      {data?.messages && data?.messages.length > 0 ? (
        data.messages.map((item, i) => (
          <div
            className={classNames("item", {
              sender: item.sender.id !== userId,
              author: item.sender.id === userId,
            })}
            key={`${item}__${i}`}
          >
            <ReturnMeContent className="text" content={item.body} />
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
                  fill={isBlackThemed ? "#3A3A3A" : "#d9d9d9"}
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
