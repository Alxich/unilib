import { FC } from "react";
import classNames from "classnames";

interface ConversationItemLoadingProps {
  author: boolean;
}

const ConversationItemLoading: FC<ConversationItemLoadingProps> = ({
  author,
}: ConversationItemLoadingProps) => {
  return (
    <div
      className={classNames("item", {
        sender: author === false,
        author: author === true,
      })}
    >
      <span className="text" />
      <span className="time" />
      <div className="triangle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
        >
          <path
            d="M13.151 7.42547C14.4092 8.4122 14.0581 10.4033 12.5383 10.9002L3.105 13.9843C1.66944 14.4536 0.25162 13.2234 0.513886 11.736L2.1376 2.52749C2.39986 1.04011 4.15294 0.368995 5.34141 1.30101L13.151 7.42547Z"
            fill="#3A3A3A"
          />
        </svg>
      </div>
    </div>
  );
};

export default ConversationItemLoading;
