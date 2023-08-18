import { FC } from "react";

import { signOut } from "next-auth/react";

import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface NotificationProps {
  username?: string | null;
  items:
    | {
        title?: string;
        content?: string;
        link?: string;
        icon?: any;
        type?: string;
      }[]
    | {}[];
  activeElem: boolean;
  type: string;
  clear?: () => void;
  markAsRead?: {
    (id: string | string[]): void;
    (id: string | string[], read?: boolean | undefined): void;
  };
}

const Notification: FC<NotificationProps> = ({
  username,
  items,
  activeElem,
  type,
  clear,
  markAsRead,
}: NotificationProps) => {
  return (
    <div
      className={classNames("notification container flex-right", {
        active: activeElem,
        hidden: activeElem !== true,
        "is-complain": type === "complain",
        "is-user": type === "user",
      })}
    >
      <div className="triangle"></div>
      <div className="wrapper-content container flex-left content-use">
        <div className="header container flex-space flex-row">
          {type != "user" ? (
            <>
              <div className="title">
                <h6>Усі повідомлення</h6>
              </div>
              <div className="actions container flex-center flex-row width-auto">
                {/* {type != "complain" && (
                  <Link href={"/messages/all"} className="item">
                    <p>Відкрити усі</p>
                  </Link>
                )} */}
                <div className="item">
                  {type != "complain" ? (
                    <p onClick={() => clear && clear()}>Очистити</p>
                  ) : (
                    <p>Закрити</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="welcomer">
                <div className="text-block">
                  <p>Привіт, </p>
                </div>
                <div className="title">
                  <h6>{username ? username : "Інкогніто"}</h6>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="main container flex-left">
          {items?.map((item, i) => {
            const {
              id,
              link,
              title,
              content,
              icon,
              type,
              read,
            }: {
              id?: string;
              title?: string;
              content?: string;
              link?: string;
              icon?: any;
              type?: string;
              read?: boolean;
            } = item;

            return link ? (
              <Link
                href={link}
                className="item container flex-left flex-row"
                key={`${item}__${i}`}
                onClick={() => {
                  type === "signOut" && signOut();
                }}
              >
                {type != "complain" && type != "user" && (
                  <div className="user-ico"></div>
                )}
                <div
                  className={classNames("content container", {
                    "flex-row": type === "user",
                    "width-auto": type !== "user",
                  })}
                >
                  {icon && (
                    <div className="fafont-icon interactive">
                      <FontAwesomeIcon
                        icon={icon}
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "inherit",
                        }}
                      />
                    </div>
                  )}
                  {type !== "user" && (
                    <div className="title">
                      <p>{type}</p>
                    </div>
                  )}

                  <div className="text">
                    <p>{type === "user" ? title : content}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className={classNames("item container flex-left flex-row", {
                  unread: !read,
                })}
                key={`${item}__${i}`}
                onClick={() => {
                  type === "signOut" && signOut();
                  type !== "signOut" && id && markAsRead && markAsRead(id);
                }}
              >
                {type != "complain" && type != "user" && (
                  <div
                    className={classNames("user-ico", {
                      success: type == "success",
                      error: type == "error",
                    })}
                  />
                )}
                <div
                  className={classNames("content container", {
                    "flex-row": type === "user",
                    "full-width": type !== "user",
                  })}
                >
                  {icon && (
                    <div className="fafont-icon interactive">
                      <FontAwesomeIcon
                        icon={icon}
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "inherit",
                        }}
                      />
                    </div>
                  )}
                  {type !== "user" && (
                    <div className="title">
                      <p>Notafication about {type}</p>
                    </div>
                  )}

                  <div className="text">
                    <p>{type === "user" ? title : content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notification;
