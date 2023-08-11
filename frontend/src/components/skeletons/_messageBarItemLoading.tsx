import { FC } from "react";

interface MessageBarItemLoadingProps {}

const MessageBarItemLoading: FC<
  MessageBarItemLoadingProps
> = ({}: MessageBarItemLoadingProps) => {
  return (
    <div className={"item message loading-component"}>
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
};

export default MessageBarItemLoading;
