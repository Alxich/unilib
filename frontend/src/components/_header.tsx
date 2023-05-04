import React, { FC, useEffect } from "react";
import classNames from "classnames";
import { ObjectId } from "bson";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Session } from "next-auth";

import { useMutation, useQuery } from "@apollo/client";

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

import PostsOperations from "../graphql/operations/posts";
import { CreatePostArguments, PostData, PostsVariables } from "../util/types";

interface HeaderProps {
  session: Session;
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

  const [createPost] = useMutation<
    { createPost: boolean },
    CreatePostArguments
  >(PostsOperations.Mutations.createPost);

  const onCreatePost = async () => {
    // event.preventDefault();

    try {
      const { id: userID, username } = session.user;
      const newId = new ObjectId().toString();
      const post = {
        id: newId,
        title: "New Post",
        content: "This is the content of my new post",
        authorId: userID,
        authorName: username,
      };

      const { data, errors } = await createPost({
        variables: {
          ...post,
        },
        /**
         * Optimistically update UI
         */
        // optimisticResponse: {
        //   createPost: true,
        // },
      });

      if (!data?.createPost || errors) {
        throw new Error("Error creating post");
      }
    } catch (error: any) {
      console.log("onCreatePost error", error);
      toast.error(error?.message);
    }
  };

  const id = "6453ff3d35a60160df3f6f3f";

  const { data, loading, error, subscribeToMore } = useQuery<
    PostData,
    PostsVariables
  >(PostsOperations.Queries.queryPosts, {
    variables: {
      id,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  console.log(data);

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
              // setWritterActive(true)
              onCreatePost();
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
