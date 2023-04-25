import { FC, useEffect, useState } from "react";
import classNames from "classnames";

import { Session } from "next-auth";
import { UserVariables } from "../util/types";

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
  const [userData, setUserData] = useState<UserVariables | undefined>(
    undefined
  );

  useEffect(() => {
    if (session !== null && session !== undefined) {
      setUserData(session.user);
    }
  }, [session]);

  return (
    <div
      id="banner"
      className={classNames({
        active:
          userData !== undefined && !userData.username ? true : bannerActive,
      })}
    >
      <div className="background"></div>
      <div
        className={classNames("wrapper container", {
          nickname: !userData?.username,
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
          <UsernameCreate />
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
