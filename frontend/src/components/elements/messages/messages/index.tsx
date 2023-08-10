import { FC, useContext, useState } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import MessagesItem from "./_messagesItem";
import OhfailPage from "../_ohfailpage";

import { Session } from "next-auth";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../../backend/src/util/types";

import MessagesModal from "./modal/_messagesModal";
import { IModalContext, ModalContext } from "../../../../context/ModalContent";

import sadSaymonCat from "../../../../../public/images/sad-saymon.png";
import { getUserParticipantObject } from "../../../../util/functions";

interface MessagesProps {
  conversationsLoading: boolean;
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const Messages: FC<MessagesProps> = ({
  conversations,
  conversationsLoading,
  onViewConversation,
  session,
}: MessagesProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [openConversationCreation, setOpenConversationCreation] =
    useState(false);
  const { modalOpen, openModal, closeModal } =
    useContext<IModalContext>(ModalContext);
  const [editingConversation, setEditingConversation] =
    useState<ConversationPopulated | null>(null);

  const toggleClose = () => {
    setEditingConversation(null);
    closeModal();
  };

  return (
    <div id="messages-list">
      <div className="header container flex-row flex-space full-width">
        <div className="title">
          <h5>
            {conversations.length > 0
              ? "Усі наявні повідомлення"
              : "У вас немає нявних повідомлень"}
          </h5>
        </div>

        <div className="changer open-more messages">
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
                className={classNames({ active: openConversationCreation })}
                onClick={() => {
                  setOpenConversationCreation(true);
                  setOpenFilter(false);
                }}
              >
                Cтворити співрозмову
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container full-width">
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
        ) : !conversationsLoading &&
          conversations &&
          conversations.length > 0 ? (
          conversations.map((item, i) => {
            const { hasSeenLatestMessage } = getUserParticipantObject(
              session,
              item
            );

            return (
              <MessagesItem
                key={`${item.id}__${i}`}
                onClick={() =>
                  onViewConversation(item.id, hasSeenLatestMessage)
                }
                userId={session.user.id}
                hasSeenLatestMessage={hasSeenLatestMessage}
                data={item}
              />
            );
          })
        ) : (
          <OhfailPage
            image={sadSaymonCat}
            text={
              "Ласкаво просимо у порожній світ повідомлень! Тут немає нічого. Здається, вам немає з ким спілкуватись. Знайдіть собі супутника для бесіди, бо тут тільки пустка. Ну, або можете нікого не шукати і спостерігати, як пил збирається на вашому екрані. Вибір за вами."
            }
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
