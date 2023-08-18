import { useEffect, FC, useState } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import toast from "react-toastify";

import { Session } from "next-auth";

import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import ConversationOperations from "../../../../graphql/operations/conversations";
import MessageOperations from "../../../../graphql/operations/messages";
import {
  ConversationsData,
  ConversationUpdatedData,
  MessagesData,
  ConversationDeletedData,
  ConversationCreatedSubscriptionData,
} from "../../../../util/types";
import { ParticipantPopulated } from "../../../../../../backend/src/util/types";
import { ConversationPopulated } from "../../../../../../backend/src/util/types";
import MessagesBarChatItem from "./_messagesBarChatItem";

import { getUserParticipantObject } from "../../../../util/functions";
import { MessageBarItemLoading } from "../../../skeletons";

interface MessagesBarChatsWrapperProps {
  session: Session;
}

const MessagesBarChatsWrapper: FC<MessagesBarChatsWrapperProps> = ({
  session,
}: MessagesBarChatsWrapperProps) => {
  const [conversationArray, setConversationArray] = useState<
    ConversationPopulated[] | undefined | null
  >([]);
  const [userId, setUserId] = useState<string | undefined>();
  const router = useRouter();
  const conversationId = router.query.id;

  useEffect(() => {
    if (session) {
      const {
        user: { id: userId },
      } = session;

      setUserId(userId);
    }
  }, [session]);

  /**
   * Queries
   */
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
      onCompleted(data) {
        setConversationArray(data.conversations);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  /**
   * Mutations
   */
  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  /**
   * Subscriptions
   */
  useSubscription<ConversationUpdatedData, null>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: {
            conversation: updatedConversation,
            addedUserIds,
            removedUserIds,
          },
        } = subscriptionData;

        if (!conversationsData) return;

        const updatedArray = conversationsData.conversations.map(
          (conversation) => {
            if (conversation.id === updatedConversation.id) {
              return updatedConversation;
            } else {
              return conversation;
            }
          }
        );

        setConversationArray(updatedArray);

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        /**
         * Check if user is being removed
         */
        if (removedUserIds && removedUserIds.length) {
          const isBeingRemoved = removedUserIds.find((id) => id === userId);

          if (isBeingRemoved) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
              data: {
                conversations: conversationsData.conversations.filter(
                  (c) => c.id !== updatedConversationId
                ),
              },
            });

            if (conversationId === updatedConversationId) {
              router.replace(
                typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                  ? process.env.NEXT_PUBLIC_BASE_URL
                  : ""
              );
            }

            /**
             * Early return - no more updates required
             */
            return;
          }
        }

        /**
         * Check if user is being added to conversation
         */
        if (addedUserIds && addedUserIds.length) {
          const isBeingAdded = addedUserIds.find((id) => id === userId);

          if (isBeingAdded) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
              data: {
                conversations: [
                  ...(conversationsData.conversations || []),
                  updatedConversation,
                ],
              },
            });
          }
        }

        /**
         * Already viewing conversation where
         * new message is received; no need
         * to manually update cache due to
         * message subscription
         */
        if (updatedConversationId === conversationId) {
          onViewConversation(conversationId, false);
          return;
        }

        const existing = client.readQuery<MessagesData>({
          query: MessageOperations.Query.messages,
          variables: { conversationId: updatedConversationId },
        });

        if (!existing) return;

        /**
         * Check if lastest message is already present
         * in the message query
         */
        const hasLatestMessage = existing.messages.find(
          (m) => m.id === latestMessage.id
        );

        /**
         * Update query as re-fetch won't happen if you
         * view a conversation you've already viewed due
         * to caching
         */
        if (!hasLatestMessage) {
          client.writeQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId: updatedConversationId },
            data: {
              ...existing,
              messages: [latestMessage, ...existing.messages],
            },
          });
        }
      },
    }
  );

  // Subscribe to the conversationDeleted subscription

  useSubscription<ConversationDeletedData, null>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        // Extract subscription data from the received data
        const { data: subscriptionData } = data;

        // Return if there is no subscription data
        if (!subscriptionData) return;

        // Read the existing conversations data from the cache
        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
        });

        // Return if there is no existing data

        if (!existing) return;

        // Extract conversationDeleted ID from the subscription data
        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        // Filter out the deleted conversation from the existing conversations
        // Write the updated conversations data back to the cache
        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push(`/messages/chat/${conversationId}`);

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    try {
      if (!userId) return;

      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants
           * from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          /**
           * Create copy to
           * allow mutation
           */
          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          /**
           * Should always be found
           * but just in case
           */
          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update user to show latest
           * message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.error("onViewConversation error", error);
    }
  };

  // Function to subscribe to new conversation creation
  const subscribeToNewConversations = () => {
    // Subscribe to the conversationCreated subscription
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        // If there's no new data in the subscription, return the previous state
        if (!subscriptionData.data) return prev;

        // Extract the new conversation from the subscription data
        const newConversation = subscriptionData.data.conversationCreated;

        // Merge the new conversation with the previous conversations array
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (conversationsError) {
    toast.error("There was an error fetching conversations");
    return null;
  }

  return (
    <>
      <div className="header messages container full-width flex-row flex-space">
        <div className="title">
          <p>Усі повідомлення</p>
        </div>
        <Link href={"/messages/all"}>Показати усі</Link>
      </div>
      <div className="container full-width">
        {conversationsLoading ? (
          <>
            <MessageBarItemLoading />
            <MessageBarItemLoading />
            <MessageBarItemLoading />
            <MessageBarItemLoading />
          </>
        ) : (
          conversationArray &&
          conversationArray.map((item, i) => {
            const { hasSeenLatestMessage } = getUserParticipantObject(
              session,
              item
            );

            return (
              <MessagesBarChatItem
                key={`${item.id}__${i}`}
                onClick={() =>
                  onViewConversation(item.id, hasSeenLatestMessage)
                }
                userId={session.user.id}
                hasSeenLatestMessage={hasSeenLatestMessage}
                currentChat={conversationId === item.id}
                data={item}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default MessagesBarChatsWrapper;
