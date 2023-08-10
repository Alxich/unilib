import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "../../_button";

import { Session } from "next-auth";
import { useMutation, useQuery } from "@apollo/client";

import ConversationOperations from "../../../../graphql/operations/conversations";
import { AuthorInfoTypes, ConversationCreatedSubscriptionData, ConversationsData, CreateConversationData, SearchUserData, SearchedUser } from "../../../../util/types";
import { useRouter } from "next/router";
import { ConversationPopulated } from "../../../../../../backend/src/util/types";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";

type AuthorinfoWriteProps = {
  setConversationsLoading: Dispatch<SetStateAction<boolean>>;
  blockContent?: AuthorInfoTypes;
  session?: Session;
};

const AuthorinfoWrite: FC<AuthorinfoWriteProps> = ({
  session,
  blockContent,
  setConversationsLoading,
}: AuthorinfoWriteProps) => {
  /**
   * Create conversation functions
   */

  /**
   * Query all conversations to check existing conversations with user
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

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

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
  }

  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  const router = useRouter();

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutations.createConversation
    );

  /**
   * Verifies that a conversation with selected
   * participants does not already exist
   */
  const findExistingConversation = (participantIds: Array<string>) => {
    let existingConversation: ConversationPopulated | null = null;

    if (!conversationsData) return true;

    for (const conversation of conversationsData.conversations) {
      const addedParticipants = conversation.participants.filter(
        (p) => p.user.id !== session?.user.id
      );

      if (addedParticipants.length === participantIds.length) {
        continue;
      }

      let allMatchingParticipants: boolean = false;
      for (const participant of addedParticipants) {
        const foundParticipant = participantIds.find(
          (p) => p === participant.user.id
        );

        if (!foundParticipant) {
          allMatchingParticipants = false;
          break;
        }

        /**
         * If we hit here,
         * all match
         */
        allMatchingParticipants = true;
      }

      if (allMatchingParticipants) {
        existingConversation = conversation;
      }
    }

    return existingConversation;
  };

  const onCreateConversation = async () => {
    try {
      if (!session?.user.id)
        throw new Error("Failed to create conversation | Not authorized");

      const participantIds = [...participants.map((p) => p.id)];

      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });

      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;

      router.push(`/messages/chat/${conversationId}`);
    } catch (error: any) {
      console.error("createConversations error", error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (users: SearchedUser[]) => {
    setParticipants(users);
  };

  useEffect(() => {
    if (blockContent?.username && blockContent?.id && session?.user) {
      addParticipant([
        {
          id: blockContent.id,
          username: blockContent.username,
        },
        {
          id: session.user.id,
          username: session.user.username,
        },
      ]);
    }
  }, [blockContent, session]);

  const onSubmit = () => {
    if (!participants.length) {
      toast.error("Error to create a new conversation");
      return;
    }

    const participantIds = participants.map((p) => p.id);

    const existing = findExistingConversation(
      participantIds
    ) as ConversationPopulated | null;

    if (existing) {
      router.push(`/messages/chat/${existing.id}`);
      return;
    }

    onCreateConversation();
  };

  return (
    <Button
      filled
      small
      writeAuthor
      loading={createConversationLoading}
      iconIncluded
      disabled={!participants}
      iconName={faPenClip}
      onClick={() => onSubmit()}
    >
      Написати
    </Button>
  );
};

export default AuthorinfoWrite;
