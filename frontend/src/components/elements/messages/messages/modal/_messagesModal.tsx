import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../_button";

import Participants from "./_participants";
import UserList from "./_userList";
import MessagesItem from "../_messagesItem";

import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../../../backend/src/util/types";
import ConversationOperations from "../../../../../graphql/operations/conversations";
import UserOperations from "../../../../../graphql/operations/users";
import {
  CreateConversationData,
  SearchedUser,
  SearchUsersData,
  SearchUsersInputs,
} from "../../../../../util/types";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  conversations: Array<ConversationPopulated>;
  editingConversation: ConversationPopulated | null;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
  getUserParticipantObject: (
    session: Session,
    conversation: ConversationPopulated
  ) => ParticipantPopulated;
}

const MessagesModal: FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  session,
  conversations,
  editingConversation,
  onViewConversation,
  getUserParticipantObject,
}: ConversationModalProps) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  const [existingConversation, setExistingConversation] =
    useState<ConversationPopulated | null>(null);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  // useLazyQuery for searching users
  const [
    searchUsers,
    {
      data: searchUsersData,
      loading: searchUsersLoading,
      error: searchUsersError,
    },
  ] = useLazyQuery<SearchUsersData, SearchUsersInputs>(
    UserOperations.Queries.searchUsers
  );

  // useMutation for creating a new conversation
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutations.createConversation
    );

  // useMutation for updating participants in a conversation
  const [updateParticipants, { loading: updateParticipantsLoading }] =
    useMutation<
      { updateParticipants: boolean },
      { conversationId: string; participantIds: Array<string> }
    >(ConversationOperations.Mutations.updateParticipants);

  const onSubmit = () => {
    if (!participants.length) return;

    const participantIds = participants.map((p) => p.id);

    const existing = findExistingConversation(participantIds);

    if (existing) {
      toast("Conversation already exists");
      setExistingConversation(existing);
      return;
    }

    /**
     * Determine which function to call
     */
    editingConversation
      ? onUpdateConversation(editingConversation)
      : onCreateConversation();
  };

  /**
   * Verifies that a conversation with selected
   * participants does not already exist
   */
  const findExistingConversation = (participantIds: Array<string>) => {
    let existingConversation: ConversationPopulated | null = null;

    for (const conversation of conversations) {
      const addedParticipants = conversation.participants.filter(
        (p) => p.user.id !== userId
      );

      if (addedParticipants.length !== participantIds.length) {
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
    const participantIds = [userId, ...participants.map((p) => p.id)];

    try {
      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });

      // Check if there is no errors or empty data

      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;
      router.push(`/messages/chat/${conversationId}`);

      /**
       * Clear state and close modal
       * on successful creation
       */
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.error("createConversations error", error);
      toast.error(error?.message);
    }
  };

  const onUpdateConversation = async (conversation: ConversationPopulated) => {
    const participantIds = participants.map((p) => p.id);

    try {
      const { data, errors } = await updateParticipants({
        variables: {
          conversationId: conversation.id,
          participantIds,
        },
      });

      // Check if there is no errors or empty data

      if (!data?.updateParticipants || errors) {
        throw new Error("Failed to update participants");
      }

      /**
       * Clear state and close modal
       * on successful update
       */
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error) {
      console.error("onUpdateConversation error", error);
      toast.error("Failed to update participants");
    }
  };

  // Function triggered when the search form is submitted
  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    searchUsers({ variables: { username } }); // Call the searchUsers mutation with the provided username
  };

  // Function to add a participant to the conversation
  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]); // Update participants by adding the new user
    setUsername(""); // Clear the username field
  };

  // Function to remove a participant from the conversation
  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((u) => u.id !== userId)); // Update participants by filtering out the user with the provided userId
  };

  // Function triggered when a conversation is clicked
  const onConversationClick = () => {
    if (!existingConversation) return; // If no existing conversation, return

    // Retrieve whether the current user has seen the latest message in the conversation
    const { hasSeenLatestMessage } = getUserParticipantObject(
      session,
      existingConversation
    );

    // Call onViewConversation function with conversation details and whether the user has seen the latest message
    onViewConversation(existingConversation.id, hasSeenLatestMessage);

    onClose(); // Close the conversation window
  };

  /**
   * If a conversation is being edited,
   * update participant state to be that
   * conversations' participants
   */
  useEffect(() => {
    if (editingConversation) {
      setParticipants(
        editingConversation.participants.map((p) => p.user as SearchedUser)
      );
      return;
    }
  }, [editingConversation]);

  /**
   * Reset existing conversation state
   * when participants added/removed
   */
  useEffect(() => {
    setExistingConversation(null);
  }, [participants]);

  /**
   * Clear participant state if closed
   */
  useEffect(() => {
    if (!isOpen) {
      setParticipants([]);
    }
  }, [isOpen]);

  if (searchUsersError) {
    toast.error("Error searching for users");
    return null;
  }

  return (
    <div
      id="messages-modal"
      className={classNames({
        active: isOpen,
      })}
    >
      <div className="container">
        <div className="header container flex-row flex-space">
          <div className="title">
            <h5>
              {editingConversation
                ? "Оновити співрозмову"
                : "Знайти або створити співрозмову"}
            </h5>
          </div>
          <div className="fafont-icon big interactive cross" onClick={onClose}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
        </div>
        <div className="container">
          <form onSubmit={onSearch} className="container flex-row">
            <input
              placeholder="Введіть нікнейм користувача"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
            <Button filled loading={searchUsersLoading} disabled={!username}>
              Пошук
            </Button>
          </form>
          {searchUsersData?.searchUsers && (
            <UserList
              users={searchUsersData.searchUsers}
              participants={participants}
              addParticipant={addParticipant}
            />
          )}
          {participants.length !== 0 && (
            <>
              <Participants
                participants={participants.filter((p) => p.id !== userId)}
                removeParticipant={removeParticipant}
              />
              <div className="existing-conversation container flex-start">
                {existingConversation && (
                  <>
                    <div className="title">
                      <p>
                        У важ вже існує дана співрозмова з цим{"(и)"}{" "}
                        користувчем
                        {"(чами)"}
                      </p>
                    </div>
                    <MessagesItem
                      userId={userId}
                      data={existingConversation}
                      hasSeenLatestMessage={true}
                      onClick={() => onConversationClick()}
                    />
                  </>
                )}
              </div>
              <Button
                filled
                disabled={!!existingConversation}
                loading={createConversationLoading || updateParticipantsLoading}
                onClick={onSubmit}
              >
                {editingConversation ? "Оновити бесіду" : "Створити бесіду"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default MessagesModal;
