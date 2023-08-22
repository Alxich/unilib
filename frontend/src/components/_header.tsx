import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import classNames from "classnames";

import Link from "next/link";
import Image from "next/image";

import { Session } from "next-auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBell,
  faIdBadge,
  faGears,
  faRightFromBracket,
  faScrewdriver,
  faEnvelopeOpen,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Notification } from "./elements";
import UserIcon from "../../public/images/user-icon.png";
import { useEscapeClose } from "../util/functions/useEscapeClose";
import { useScrollToTop } from "../util/functions/useScrollToTop";
interface HeaderProps {
  session: Session | null;
  setBannerActive: any;
  writterActive: boolean;
  setWritterActive: any;
  setSearchText: Dispatch<SetStateAction<string | undefined>>;
  activeNotify: boolean;
  setActiveNotfiy: Dispatch<SetStateAction<boolean>>;
  activeUser: boolean;
  setActiveUser: Dispatch<SetStateAction<boolean>>;
  notifications: any[];
  clear: () => void;
  markAsRead: {
    (id: string | string[]): void;
    (id: string | string[], read?: boolean | undefined): void;
  };
  unreadCount: number;
}

const Header: FC<HeaderProps> = ({
  setBannerActive,
  session,
  writterActive,
  setWritterActive,
  setSearchText,
  activeNotify,
  setActiveNotfiy,
  activeUser,
  setActiveUser,
  notifications,
  clear,
  markAsRead,
  unreadCount,
}: HeaderProps) => {
  // Using useScrollToTop to allow scroll on click

  const { scrollToTop } = useScrollToTop();

  // Using useEscapeClose to close notify elem via escape button

  useEscapeClose({
    activeElem: activeNotify,
    setActiveElem: setActiveNotfiy,
  });

  // Using useEscapeClose to close user elem via escape button

  useEscapeClose({
    activeElem: activeUser,
    setActiveElem: setActiveUser,
  });

  const userItems = [
    {
      title: "Мій аккаунт",
      link: `/author/${session?.user.id}`,
      icon: faIdBadge,
    },
    {
      title: "Мої повідомлення",
      link: `/messages/all`,
      icon: faEnvelopeOpen,
    },
    {
      title: "Настройки аккаунту",
      link: `/author/${session?.user.id}/edit`,
      icon: faGears,
    },

    {
      ...(session?.user.isAdmin && {
        title: "Адміністрація сайту",
        link: `/admin`,
        icon: faScrewdriver,
      }),
    },

    {
      content: "Вийти з аккаунту",
      type: "signOut",
      icon: faRightFromBracket,
    },
  ];

  // There is func that performs the search methods

  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
  const [userText, setUserText] = useState<string | undefined>();

  const performSearch = (searchText: string | undefined, delay: number) => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    setSearchTimer(
      setTimeout(() => {
        setSearchText(searchText);
      }, delay)
    );
  };

  return (
    <header
      className={classNames("masthead", {
        "writter-active": writterActive,
      })}
    >
      <div className="container full-height flex-space flex-row content-pad">
        <Link href={"/"} className="logo" onClick={(e) => scrollToTop(e)}>
          <p>UNILIB</p>
        </Link>
        <div
          className={classNames("interagtions container full-height flex-row", {
            "writter-active": writterActive,
          })}
        >
          <form className="search">
            <input
              name="Search"
              type="text"
              placeholder="Напишіть сюди щоб знайти те що шукаєте ..."
              value={userText}
              onChange={(e) => {
                setUserText(e.target.value);
                performSearch(e.target.value, 1000);
              }}
            />
          </form>

          <Button
            iconIncluded
            iconName={faPlus}
            filled
            big
            onClick={() => {
              setWritterActive(true);
            }}
            disabled={!session?.user}
          >
            {"Cтворити"}
          </Button>
        </div>
        <div
          className={classNames(
            "user-action container full-height flex-row width-auto",
            {
              "not-logged": !session?.user,
              logged: session?.user,
            }
          )}
        >
          <div
            className={classNames("fafont-icon big interactive", {
              active: unreadCount > 0,
            })}
          >
            <FontAwesomeIcon
              onClick={() => {
                setActiveUser(false);
                setActiveNotfiy(activeNotify ? false : true);
              }}
              icon={faBell}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
            <Notification
              activeElem={activeNotify}
              type={"notification"}
              items={notifications}
              clear={clear}
              markAsRead={markAsRead}
            />
          </div>
          {session?.user && (
            <div className="fafont-icon big interactive user">
              <div
                className="user-icon"
                onClick={() => {
                  setActiveNotfiy(false);
                  setActiveUser(activeUser ? false : true);
                }}
              >
                <Image
                  src={session?.user?.image ? session?.user?.image : UserIcon}
                  height={65}
                  width={65}
                  alt="user-icon-image"
                />
              </div>
              <Notification
                username={session?.user?.username}
                activeElem={activeUser}
                type={"user"}
                items={userItems}
              />
            </div>
          )}
          {!session?.user && (
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
