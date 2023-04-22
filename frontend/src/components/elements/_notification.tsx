import Image, { StaticImageData } from "next/image";

import { signOut } from "next-auth/react";

import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface types {
  username?: string | null;
  items: {
    title: string;
    text?: string;
    icon?: any;
    type?: string;
  }[];
  activeElem: boolean;
  type: string;
}

const Notification = ({ username, items, activeElem, type }: types) => {
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
                {type != "complain" && (
                  <div className="item">
                    <p>Відкрити усі</p>
                  </div>
                )}
                <div className="item">
                  {type != "complain" ? <p>Очистити</p> : <p>Закрити</p>}
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
            const { title, text, icon, type: itemType } = item;

            return (
              <div
                className="item container flex-left flex-row"
                key={`${item}__${i}`}
                onClick={() => {
                  itemType === "signOut" && signOut();
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
                      <p>{title}</p>
                    </div>
                  )}

                  <div className="text">
                    <p>{type === "user" ? title : text}</p>
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
