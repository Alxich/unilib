import { Dispatch, FC, SetStateAction } from "react";
import Link from "next/link";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faPencilAlt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface MobilebarProps {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  writterActive: boolean;
  setWritterActive: Dispatch<SetStateAction<boolean>>;
  activeNotify: boolean;
  setActiveNotfiy: Dispatch<SetStateAction<boolean>>;
  unreadCount: number;
}

const Mobilebar: FC<MobilebarProps> = ({
  showSidebar,
  setShowSidebar,
  writterActive,
  setWritterActive,
  activeNotify,
  setActiveNotfiy,
  unreadCount,
}: MobilebarProps) => {
  return (
    <div id="mobile-bar" className="container flex-row flex-space">
      <div
        className="header-btn fafont-icon big interactive cross"
        onClick={() => setShowSidebar(showSidebar ? false : true)}
      >
        <FontAwesomeIcon
          icon={showSidebar ? faXmark : faBars}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </div>

      <div
        className="header-btn fafont-icon big interactive"
        onClick={() => setWritterActive(writterActive ? false : true)}
      >
        <FontAwesomeIcon
          icon={writterActive ? faXmark : faPencilAlt}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </div>

      <div
        className={classNames("header-btn fafont-icon big interactive", {
          active: unreadCount > 0,
        })}
        onClick={() => setActiveNotfiy(activeNotify ? false : true)}
      >
        <FontAwesomeIcon
          icon={activeNotify ? faXmark : faBell}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </div>

      <Link
        className="header-btn fafont-icon big interactive"
        href="/messages/all"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </Link>
    </div>
  );
};

export default Mobilebar;
