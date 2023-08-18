import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Session } from "next-auth";

import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../../graphql/operations/conversations";
import { ConversationsCountData } from "../../../../util/types";

interface MessagesBarFilterItemsProps {
  session: Session;
}

const MessagesBarFilterItems: FC<MessagesBarFilterItemsProps> = ({
  session,
}: MessagesBarFilterItemsProps) => {
  const router = useRouter();
  const isMessagesAllRoute = router.query.type === "all";
  const isMessagesUnreadRoute = router.query.type === "unread";
  const isMessagesMarkedRoute = router.query.type === "marked";

  const [countAllMessages, setCountAllMessages] = useState<number | undefined>(
    0
  );
  const [countAllUnreadMessages, setCountAllUnreadMessages] = useState<
    number | undefined
  >(0);

  /**
   * Query all conversations to check existing conversations with user
   * And check the unreaded messages
   */
  const {
    data: conversationsCountData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsCountData, null>(
    ConversationOperations.Queries.conversationsCount,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  // Update counts for unread and total messages when conversations loading state changes
  useEffect(() => {
    // Function to count unread messages based on conversation data
    const countUnreadedMessages = () => {
      const conversationsCount =
        conversationsCountData?.conversationsCount || [];

      // Filter messages to find those that the current user hasn't seen
      const filteredMessages = conversationsCount.filter((item) => {
        const currentUserParticipant = item.participants.find(
          (participant) => participant.user.id === session.user.id
        );

        return currentUserParticipant?.hasSeenLatestMessage === false;
      });

      return filteredMessages;
    };

    // Count unread messages
    const unreadMessages = countUnreadedMessages();
    const countUnreaded = unreadMessages.length;

    // Update state with the count of all unread messages (minimum 0)
    setCountAllUnreadMessages(countUnreaded > 0 ? countUnreaded : 0);

    // Count total messages
    const countAllMessages =
      conversationsCountData?.conversationsCount.length || 0;
    setCountAllMessages(countAllMessages);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsLoading]);

  return (
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
          <span className="count">{countAllMessages}</span>
        </Link>
        <Link
          href={"/messages/unread"}
          className={classNames("item bars", {
            active: isMessagesUnreadRoute,
          })}
        >
          <span className="title">Непрочитано</span>
          <span className="count">{countAllUnreadMessages}</span>
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
  );
};
export default MessagesBarFilterItems;
