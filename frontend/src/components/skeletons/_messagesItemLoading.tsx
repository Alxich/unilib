import { FC } from "react";

interface MessagesItemLoadingProps {}

const MessagesItemLoading: FC<MessagesItemLoadingProps> = (
  props: MessagesItemLoadingProps
) => (
  <div className="item loading-component">
    <span className="user-icon" />
    <div className="container full-width">
      <div className="user-titles">
        <div className="username">
          <span />
        </div>
        <div className="time">
          <span />
        </div>
      </div>
      <div className="information">
        <span className="text" />
      </div>
    </div>
  </div>
);

export default MessagesItemLoading;
