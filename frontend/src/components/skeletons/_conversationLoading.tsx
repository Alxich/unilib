import { FC } from "react";
import ConversationItemLoading from "./_conversationItemLoading";

interface ConversationLoadingProps {}

const ConversationLoading: FC<ConversationLoadingProps> = (
  props: ConversationLoadingProps
) => {
  return (
    <div id="conversation" className="loading-component">
      <div className="header container flex-row flex-space full-width">
        <div className="infromation">
          <span className="user-icon" />
          <div className="username">
            <span />
          </div>
        </div>

        <span className="changer open-more" />
      </div>

      <div className="conversation-wrapper loading-component">
        <ConversationItemLoading author={true} />
        <ConversationItemLoading author={false} />
        <ConversationItemLoading author={true} />
        <ConversationItemLoading author={false} />
      </div>
    </div>
  );
};

export default ConversationLoading;
