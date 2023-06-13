import React, { FC } from "react";
import classNames from "classnames";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Session } from "next-auth";

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

import { useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import toast from "react-hot-toast";

import CategoriesOperations from "../graphql/operations/categories";
import TagsOperations from "../graphql/operations/tags";
import { CreateCategoryArguments, CreateTagArguments } from "../util/types";

interface HeaderProps {
  session: Session | null;
  setBannerActive: any;
  writterActive: boolean;
  setWritterActive: any;
}

const Header: FC<HeaderProps> = ({
  setBannerActive,
  session,
  writterActive,
  setWritterActive,
}: HeaderProps) => {
  const router = useRouter();

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

  // Starting working with backend and using hoo createCategory

  const [createCategory] = useMutation<
    { createCategory: boolean },
    CreateCategoryArguments
  >(CategoriesOperations.Mutations.createCategory);

  const onCreateCategory = async () => {
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");

      return null;
    }

    try {
      const { username } = session.user;
      const newId = new ObjectId().toString();

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const category = {
        id: newId,
        banner:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.w3villa.com%2Fservices%2F39%2Foriginal%2Fgame-development-new.jpg&f=1&nofb=1&ipt=371746079e99f40125da9a4df347a7959b3769c8b4df9031e4fbfcd98a74f555&ipo=images",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fgame-development-isolated-icon-simple-element-illustration-programming-concept-icons-editable-logo-sign-symbol-design-142291415.jpg&f=1&nofb=1&ipt=b09c6e17fc39f7160fbb51b23d055c796ef971f69f26a64f7680b5f01d1f5827&ipo=images",
        title: "Gamedev",
        desc: "It is a Gamedev cateogory bla bla bla welcome",
      };

      const { data, errors } = await createCategory({
        variables: {
          ...category,
        },
      });

      if (!data?.createCategory || errors) {
        throw new Error("Error creating category");
      }

      if (!errors) {
        toast.success("Category was created!");
      }
    } catch (error: any) {
      console.error("onCreateCategory error", error);
      toast.error(error?.message);
    }
  };

  const [createTag] = useMutation<
  { createTag: boolean }, 
  CreateTagArguments>(TagsOperations.Mutations.createTag);

  const onCreateTag = async () => {
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");

      return false;
    }

    try {
      const { username } = session.user;
      const newId = new ObjectId().toString();

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const tag = {
        id: newId,
        title: "gamedevelop",
      };

      const { data, errors } = await createTag({
        variables: {
          ...tag,
        },
      });

      if (!data?.createTag || errors) {
        throw new Error("Error creating tag");
      }

      if (!errors) {
        toast.success("Tag was created!");
      }
    } catch (error: any) {
      console.error("onCreateTag error", error);
      toast.error(error?.message);
    }
  };

  return (
    <header
      className={classNames("masthead", {
        "writter-active": writterActive,
      })}
    >
      <div className="container full-height flex-space flex-row content-pad">
        <Link href={"/"} className="logo" onClick={(e) => scroolToTop(e)}>
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
          <Button
            iconIncluded
            iconName={faPlus}
            filled
            big
            onClick={() => onCreateCategory()}
            disabled={!session?.user}
          >
            {"Cтворити категорію"}
          </Button>
          <Button
            iconIncluded
            iconName={faPlus}
            filled
            big
            onClick={() => onCreateTag()}
            disabled={!session?.user}
          >
            {"Cтворити тег"}
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
          {session?.user && (
            <div className="fafont-icon big interactive user">
              <div
                className="user-icon"
                onClick={() => setActiveUser(activeUser ? false : true)}
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
