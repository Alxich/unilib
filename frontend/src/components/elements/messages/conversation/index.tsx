import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";

import { useMutation, useQuery } from "@apollo/client";
import ConversationOperations from "../../../../graphql/operations/conversations";
import { ConversationPopulated } from "../../../../../../backend/src/util/types";

import ConversationWrapper from "./_conversationWrapper";
import ConversationInput from "./_conversationInput";
import OhfailPage from "../_ohfailpage";

import { IModalContext, ModalContext } from "../../../../context/ModalContent";

import {
  getUserParticipantObject,
  returnMeFunnyError,
} from "../../../../util/functions";
import MessagesModal from "../messages/modal/_messagesModal";

import wizzardBorisCat from "../../../../../public/images/boris-wizzard.png";
import { ConversationLoading } from "../../../skeletons";

interface ConversationProps {
  conversationId: string;
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const Conversation: FC<ConversationProps> = ({
  conversationId,
  session,
  conversations,
  onViewConversation,
}: ConversationProps) => {
  const router = useRouter();
  const [conversation, setConversation] = useState<
    ConversationPopulated | undefined
  >();
  const [openFilter, setOpenFilter] = useState(false);
  const [participants, setParticipant] = useState<(string | null)[]>();

  const [openConversationCreation, setOpenConversationCreation] =
    useState(false);
  const { modalOpen, openModal, closeModal } =
    useContext<IModalContext>(ModalContext);
  const [editingConversation, setEditingConversation] =
    useState<ConversationPopulated | null>(null);

  const { id: userId } = session.user;

  /**
   * Queries
   */
  const {
    data: conversationData,
    loading: conversationLoading,
    error: conversationError,
  } = useQuery<{ conversationById: ConversationPopulated }, { id: string }>(
    ConversationOperations.Queries.conversationById,
    {
      variables: {
        id: conversationId,
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const getUserParticipantsObject = (conversation: ConversationPopulated) => {
    return conversation.participants.map((p) => {
      return p.user.username;
    });
  };

  useEffect(() => {
    if (conversationData) {
      setConversation(conversationData.conversationById);

      const users = getUserParticipantsObject(
        conversationData.conversationById
      );

      users && setParticipant(users);
    }
  }, [conversationData]);

  /**
   * Mutations
   */

  const [updateParticipants, { loading: updateParticipantsLoading }] =
    useMutation<
      { updateParticipants: boolean },
      { conversationId: string; participantIds: Array<string> }
    >(ConversationOperations.Mutations.updateParticipants);

  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(ConversationOperations.Mutations.deleteConversation);

  const onLeaveConversation = async (conversation: ConversationPopulated) => {
    // Extract participant IDs from the conversation excluding the current user
    const participantIds = conversation.participants
      .filter((p) => p.user.id !== userId)
      .map((p) => p.user.id);

    try {
      // Using toast.promise to show loading, success, and error messages
      toast.promise(
        // Call the updateParticipants mutation to update the conversation's participants
        updateParticipants({
          variables: {
            conversationId,
            participantIds,
          },
          update: () => {
            // After updating, navigate the user back to the conversation list
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : "/messages/all"
            );
          },
        }),
        {
          loading: "Leaving conversation",
          success: "Conversation left successfully",
          error: "Failed to leave conversation",
        }
      );
    } catch (error: any) {
      console.error("onUpdateConversation error", error);
      toast.error(error?.message);
    }
  };

  const onDeleteConversation = async (conversationId: string) => {
    try {
      // Using toast.promise to show loading, success, and error messages
      toast.promise(
        // Call the deleteConversation mutation to delete the conversation
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            // After deleting, navigate the user back to the conversation list
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : "/messages/all"
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted successfully",
          error: "Failed to delete conversation",
        }
      );
    } catch (error) {
      console.error("onDeleteConversation error", error);
    }
  };

  const onEditConversation = (conversation: ConversationPopulated) => {
    // Set the conversation to be edited and open the modal
    setEditingConversation(conversation);
    openModal();
  };

  const toggleClose = () => {
    // Clear the editingConversation state, close modal, and toggle conversation creation
    setEditingConversation(null);
    setOpenConversationCreation(false);
    closeModal();

    // Reload the router (likely to reflect any changes made)
    router.reload();
  };

  if (conversationError) {
    return null;
  }

  return conversationLoading ? (
    <ConversationLoading />
  ) : conversation ? (
    <div id="conversation">
      <div className="header container flex-row flex-space full-width">
        <div className="infromation">
          <div className="user-icon"></div>
          <div className="username">
            <p>{conversation && participants?.map((item) => `${item}, `)}</p>
          </div>
        </div>

        <div className="changer open-more">
          <div className="fafont-icon interactive">
            <FontAwesomeIcon
              onClick={() => setOpenFilter(openFilter ? false : true)}
              icon={faEllipsis}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          <div
            className={classNames("wrapper container flex-right width-auto", {
              active: openFilter,
            })}
          >
            <div className="triangle"></div>
            <div className="list container flex-left width-auto">
              <p
                onClick={() => {
                  setOpenConversationCreation(true);
                  onEditConversation(conversation);
                  setOpenFilter(false);
                }}
              >
                Редагувати співрозмову
              </p>
              <p
                onClick={() => {
                  onDeleteConversation(conversationId);
                  setOpenFilter(false);
                }}
              >
                Видалити бесіду
              </p>
              <p
                onClick={() => {
                  onLeaveConversation(conversation);
                  setOpenFilter(false);
                }}
              >
                Покинути співрозмову
              </p>
            </div>
          </div>
        </div>
      </div>

      {openConversationCreation ? (
        <MessagesModal
          isOpen={modalOpen}
          onClose={toggleClose}
          session={session}
          conversations={conversations}
          editingConversation={editingConversation}
          onViewConversation={onViewConversation}
          getUserParticipantObject={getUserParticipantObject}
        />
      ) : (
        <>
          <ConversationWrapper
            conversationId={conversationId}
            userId={session.user.id}
          />
          <ConversationInput
            conversationId={conversationId}
            session={session}
          />
        </>
      )}
    </div>
  ) : (
    <div id="conversation">
      <div className="header container flex-row flex-space full-width">
        <div className="infromation">
          <div className="user-icon"></div>
          <div className="username">
            <p>Вот так вот і ломаємо сайти...</p>
          </div>
        </div>
      </div>
      <div className="conversation-wrapper">
        <OhfailPage image={wizzardBorisCat} text={returnMeFunnyError()} />
      </div>
    </div>
  );
};

export default Conversation;
