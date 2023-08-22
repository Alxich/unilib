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
          {items.length > 0 ? (
            items.map((item, i) => {
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

              return title && link ? (
                <Link
                  href={link}
                  className="item container flex-left flex-row"
                  key={`${item}__${i}`}
                  onClick={() => {
                    type === "signOut" && signOut();
                  }}
                >
                  <div
                    className={classNames("content container", {
                      "flex-row": type === "user" || link,
                      "full-width": type !== "user" || link,
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

                    {type !== "user" ||
                      (link && (
                        <div className="title">
                          <p>{type}</p>
                        </div>
                      ))}

                    <div className="text">
                      <p>{link ? title : content}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                content && (
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
                    {type != "complain" &&
                      type != "user" &&
                      type !== "signOut" && (
                        <div
                          className={classNames("user-ico", {
                            success: type == "success",
                            error: type == "error",
                          })}
                        />
                      )}
                    <div
                      className={classNames("content container", {
                        "flex-row": type === "user" || type === "signOut",
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
                      {type !== "user" && type !== "signOut" && (
                        <div className="title">
                          <p>
                            {type !== "signOut"
                              ? `Notafication about ${type}`
                              : title}
                          </p>
                        </div>
                      )}

                      <div className="text">
                        <p>{content}</p>
                      </div>
                    </div>
                  </div>
                )
              );
            })
          ) : (
            <div className={"item container flex-left flex-row"}>
              <div className={"user-ico"} />

              <div className={"content container full-width"}>
                <div className="title">
                  <p>Ви прочитали всі повідомлення</p>
                </div>

                <div className="text">
                  <p>У вас більше немає повідомлень вітаю !</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
