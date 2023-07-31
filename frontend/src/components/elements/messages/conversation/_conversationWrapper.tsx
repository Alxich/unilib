import { FC } from "react";
import OhfailPage from "../_ohfailpage";

import wizzardBorisCat from "../../../../../public/images/boris-wizzard.png";

interface ConversationWrapperProps {}

const ConversationWrapper: FC<ConversationWrapperProps> = (
  props: ConversationWrapperProps
) => {
  return (
    <div className="conversation-wrapper">
      {/* <div className="item">
        <div className="text">
          <p>Привіт! Як у тебе справи ?</p>
        </div>
        <p className="time">12:31</p>
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
      <div className="item">
        <div className="text">
          <p>Привіт! Як у тебе справи ?</p>
        </div>
        <p className="time">12:31</p>
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
      <div className="item">
        <div className="text">
          <p>Привіт! Як у тебе справи ?</p>
        </div>
        <p className="time">12:31</p>
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
      </div> */}
      <OhfailPage
        image={wizzardBorisCat}
        text="У вас ще немає повідомлень з цим користувачем. Якщо ви маєте бажання розмовляти з цим співрозмовником то скоріш доведеться вам самостійно написати йому першим : )"
      />
    </div>
  );
};

export default ConversationWrapper;
