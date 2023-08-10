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
  blockContent?: AuthorInfoTypes;
  session?: Session;
};

const AuthorinfoWrite: FC<AuthorinfoWriteProps> = ({
  session,
  blockContent,
}: AuthorinfoWriteProps) => {
  /**
   * Query all conversations to check existing conversations with user
   */
  // Fetch conversations data using useQuery
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore, // Function to subscribe to additional updates
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
      // Define an error handler for the query
      onError: ({ message }) => {
        // Display an error toast with the error message
        toast.error(message);
      },
    }
  );

  // Define a function to subscribe to new conversation updates
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        // Return previous data if no new data in subscription
        if (!subscriptionData.data) return prev;

        // Extract the new conversation from the subscription
        const newConversation = subscriptionData.data.conversationCreated;

        // Combine the new conversation with the previous conversations
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

  // Define a mutation to create a new conversation
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutations.createConversation
    );

  /**
   * Verifies that a conversation with selected
   * participants does not already exist
   *
   * Define a function to find an existing
   * conversation based on participant IDs
   */
  const findExistingConversation = (participantIds: Array<string>) => {
    let existingConversation: ConversationPopulated | null = null;

    // If conversationsData is not available, return null
    if (!conversationsData) return null;

    // Loop through each conversation in conversationsData
    for (const conversation of conversationsData.conversations) {
      const addedParticipants = conversation.participants.filter(
        (p) => p.user.id !== session?.user.id
      );

      /**
       * If the number of added participants matches
       * the provided participantIds,
       * skip to the next conversation
       */
      if (addedParticipants.length === participantIds.length) {
        continue;
      }

      let allMatchingParticipants: boolean = false;

      // Loop through added participants in the conversation
      for (const participant of addedParticipants) {
        const foundParticipant = participantIds.find(
          (p) => p === participant.user.id
        );

        /**
         * If a participant in participantIds is not found
         *  in the conversation, break the loop
         */
        if (!foundParticipant) {
          allMatchingParticipants = false;
          break;
        }

        /**
         * If we hit here,
         * all participants match
         */
        allMatchingParticipants = true;
      }

      /**
       * If all participants match,
       * set existingConversation to the current conversation
       */
      if (allMatchingParticipants) {
        existingConversation = conversation;
      }
    }

    // Return the found existing conversation or null
    return existingConversation;
  };

  /**
   *  Define a function to handle the creation of a new conversation
   */
  const onCreateConversation = async () => {
    try {
      // Check if the user's ID is available in the session
      if (!session?.user.id) {
        throw new Error("Failed to create conversation | Not authorized");
      }

      // Extract participant IDs from the participants array
      const participantIds = [...participants.map((p) => p.id)];

      // Create a new conversation using the createConversation mutation
      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });

      // Check for errors in the response
      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }

      // Extract the ID of the newly created conversation
      const {
        createConversation: { conversationId },
      } = data;

      // Redirect the user to the newly created conversation's chat page
      router.push(`/messages/chat/${conversationId}`);
    } catch (error: any) {
      // Display an error toast with the error message
      console.error("createConversations error", error);
      toast.error(error?.message);
    }
  };

  // Define a function to add participants to the conversation
  const addParticipant = (users: SearchedUser[]) => {
    setParticipants(users);
  };

  // Use the useEffect hook to add participants when blockContent or session changes
  useEffect(() => {
    // Check if blockContent has a username, id, and if the user session is available
    if (blockContent?.username && blockContent?.id && session?.user) {
      /**
       * Add participants to the conversation,
       * including the blockContent and the user from the session
       */
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

  // Define a function to handle the submission of the conversation creation
  const onSubmit = () => {
    // Check if there are participants selected for the conversation
    if (!participants.length) {
      // Display an error message and return if no participants are selected
      toast.error("Error to create a new conversation");
      return;
    }

    // Get the IDs of the selected participants
    const participantIds = participants.map((p) => p.id);

    // Check if there's an existing conversation with the selected participants
    const existing = findExistingConversation(
      participantIds
    ) as ConversationPopulated | null;

    // If an existing conversation is found, navigate to the chat page of that conversation
    if (existing) {
      router.push(`/messages/chat/${existing.id}`);
      return;
    }

    // If no existing conversation is found, create a new conversation
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
