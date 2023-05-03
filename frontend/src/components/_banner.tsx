import { FC, useEffect, useState, useCallback } from "react";
import classNames from "classnames";

import { Session } from "next-auth";
import { CreateUsernameVariables } from "../util/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Registration, UsualIntro, UsernameCreate } from "./elements/banner";

interface BannerProps {
  session: Session | null;
  bannerActive: boolean;
  setBannerActive: any;
}

const Banner: FC<BannerProps> = ({
  bannerActive,
  setBannerActive,
  session,
}: BannerProps) => {
  const [regClicked, setRegClicked] = useState(false);
  const [userData, setUserData] = useState<CreateUsernameVariables | undefined>(
    undefined
  );

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        bannerActive != false && setBannerActive(false);
      }
    },
    [bannerActive, setBannerActive]
  );

  useEffect(() => {
    if (session !== null && session !== undefined) {
      setUserData(session.user);
    }

    userData !== undefined && !userData.username && setBannerActive(true);
  }, [session, setBannerActive, userData]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

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
        {session?.user && !userData?.username ? (
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
