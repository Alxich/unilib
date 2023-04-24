import { FC, useEffect, useState } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Registration, UsualIntro, UsernameCreate } from "./elements/banner";

import { useSession } from "next-auth/react";

import { UserSessionData } from "../util/types";

interface BannerProps {
  bannerActive: boolean;
  setBannerActive: any;
}

const Banner: FC<BannerProps> = ({
  bannerActive,
  setBannerActive,
}: BannerProps) => {
  const [regClicked, setRegClicked] = useState(false);
  const [userData, setUserData] = useState<UserSessionData | undefined>(
    undefined
  );
  const { data } = useSession();

  useEffect(() => {
    setUserData(data?.user);
  }, [data]);

  return (
    <div
      id="banner"
      className={classNames({
        active: !userData?.username ? true : bannerActive,
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
        {!userData?.username ? (
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
