import { FC } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Conversation } from "../../../components";
import { ConversationsData } from "../../../util/types";
import ConversationOperations from "../../../graphql/operations/conversations";
import { ParticipantPopulated } from "../../../../../backend/src/util/types";

import ConversationModalProvider from "../../../context/ModalContent";

interface MessagesChatProps {}

const MessagesChat: FC<NextPage> = (props: MessagesChatProps) => {
  const router = useRouter();
  const conversationId = router.query.id;

  const { data: session } = useSession();

  /**
   * Query all conversations
   */
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
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

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push({ query: { conversationId } });

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    try {
      if (!session) return;

      const userId = session.user.id;

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

  return (
    <ConversationModalProvider>
      <div id="messages">
        {!conversationsLoading &&
          conversationsData &&
          session &&
          conversationId &&
          typeof conversationId === "string" && (
            <Conversation
              conversations={conversationsData.conversations}
              onViewConversation={onViewConversation}
              conversationId={conversationId}
              session={session}
            />
          )}
      </div>
    </ConversationModalProvider>
  );
};

export default MessagesChat;
