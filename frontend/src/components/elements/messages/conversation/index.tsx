import { FC, useState } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";

import ConversationWrapper from "./_conversationWrapper";
import ConversationInput from "./_conversationInput";

interface ConversationProps {
  conversationId: string;
  session: Session;
}

const Conversation: FC<ConversationProps> = ({
  conversationId,
  session,
}: ConversationProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [participants, setParticipant] = useState();

  return (
    <div id="conversation">
      <div className="header container flex-row flex-space full-width">
        <div className="infromation">
          <div className="user-icon"></div>
          <div className="username">
            <p>Кирило Туров</p>
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
              <p key={`12312`} className={classNames({})} onClick={() => {}}>
                Видалити бесіду
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConversationWrapper
        conversationId={conversationId}
        userId={session.user.id}
      />
      <ConversationInput conversationId={conversationId} session={session} />
    </div>
  );
};

export default Conversation;
