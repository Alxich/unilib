import { FC, useEffect, useState, useCallback } from "react";
import classNames from "classnames";

import { Session } from "next-auth";
import { CreateUsernameVariables } from "../util/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import {
  Registration,
  UsualIntro,
  UsernameCreate,
  BagReport,
} from "./elements/banner";
import { useEscapeClose } from "../util/functions/useEscapeClose";

interface BannerProps {
  session: Session | null;
  bannerActive: boolean;
  setBannerActive: any;
  bagReportActive: boolean;
}

const Banner: FC<BannerProps> = ({
  bannerActive,
  setBannerActive,
  session,
  bagReportActive,
}: BannerProps) => {
  // Initialize state variable to manage the registration clicked status
  const [regClicked, setRegClicked] = useState(false);

  // Initialize state variable to manage user data for creating a username
  const [userData, setUserData] = useState<CreateUsernameVariables | undefined>(
    undefined
  );

  // Use the useEffect hook to perform side effects after render
  useEffect(() => {
    // Check if a user session exists
    if (session !== null && session !== undefined) {
      // If a user session exists, set the user data
      setUserData(session.user);
    }

    // Check if user data exists and username is not defined
    if (userData !== undefined && !userData.username) {
      // If conditions are met, set the banner active
      setBannerActive(true);
    }
  }, [session, setBannerActive, userData]);

  /**
   * Using useEscapeClose function to close the element
   */

  useEscapeClose({
    activeElem: bannerActive,
    setActiveElem: setBannerActive,
  });

  return (
    <div
      id="banner"
      className={classNames({
        active: bannerActive,
      })}
    >
      <div className="background"></div>
      <div
        className={classNames("wrapper container", {
          nickname: userData !== undefined && !userData?.username,
        })}
      >
        <div
          className="fafont-icon big interactive cross"
          onClick={() => setBannerActive(false)}
        >
          <FontAwesomeIcon
            icon={faXmark}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
        <div className="logo">
          <p>unilib</p>
        </div>
        {bagReportActive ? (
          <BagReport />
        ) : session?.user && !userData?.username ? (
          <UsernameCreate setBannerActive={setBannerActive} />
        ) : regClicked ? (
          <Registration setRegClicked={setRegClicked} />
        ) : (
          <UsualIntro setRegClicked={setRegClicked} />
        )}
      </div>
    </div>
  );
};

export default Banner;
