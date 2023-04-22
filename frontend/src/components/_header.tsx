import React, { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBell,
  faIdBadge,
  faGears,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Notification } from "./elements";
import UserIcon from "../../public/images/user-icon.png";
import classNames from "classnames";

const Header = ({
  setBannerActive,
}: {
  setBannerActive: any;
}): ReactElement => {
  const router = useRouter();
  const { data } = useSession();

  const scroolToTop = (e: any) => {
    if (router.pathname === "/") {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [activeNotify, setActiveNotfiy] = React.useState(false);
  const [activeUser, setActiveUser] = React.useState(false);

  const notifyItems = [
    {
      title: "Шлях новачка у  мікробіології: Купив мік ...",
      text: "Ви отримали новий коментар у вашому пості ...",
    },
    {
      title: "Шлях новачка у  мікробіології: Купив мік ...",
      text: "Вам відповіли у вашому коментарі...",
    },
    {
      title: "Вам відправили запрос у друзі",
      text: "Кирилло Туров хоче вас бачити серед своїх друзів",
    },
  ];

  const userItems = [
    {
      title: "Мій аккаунт",
      icon: faIdBadge,
    },
    {
      title: "Настройки аккаунту",
      icon: faGears,
    },
    {
      title: "Вийти з аккаунту",
      type: "signOut",
      icon: faRightFromBracket,
    },
  ];

  return (
    <header className="masthead">
      <div className="container full-height flex-space flex-row content-pad">
        <Link href={"/"} className="logo" onClick={(e) => scroolToTop(e)}>
          <p>UNILIB</p>
        </Link>
        <div className="interagtions container full-height flex-row">
          <form className="search">
            <input
              name="Search"
              type="text"
              placeholder="Напишіть сюди щоб знайти те що шукаєте ..."
            />
          </form>

          <Button iconIncluded iconName={faPlus} filled big>
            {"Cтворити"}
          </Button>
        </div>
        <div
          className={classNames(
            "user-action container full-height flex-row width-auto",
            {
              "not-logged": data === null,
              logged: data !== null,
            }
          )}
        >
          <div className="fafont-icon big interactive">
            <FontAwesomeIcon
              onClick={() => setActiveNotfiy(activeNotify ? false : true)}
              icon={faBell}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
            <Notification
              activeElem={activeNotify}
              type={"notification"}
              items={notifyItems}
            />
          </div>
          {data?.user && (
            <div
              className="fafont-icon big interactive user"
              onClick={() => setActiveUser(activeUser ? false : true)}
            >
              <div className="user-icon">
                <Image src={UserIcon} alt="user-icon-image" />
              </div>
              <Notification
                username={data?.user?.name}
                activeElem={activeUser}
                type={"user"}
                items={userItems}
              />
            </div>
          )}
          {data === null && (
            <Button filled onClick={() => setBannerActive(true)}>
              Увійти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
