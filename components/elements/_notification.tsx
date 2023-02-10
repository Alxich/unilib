import Image from "next/image";
import classNames from "classnames";

interface types {
  items: {
    title: string;
    text: string;
  }[];
  activeElem: boolean;
  type: string;
}

const Notification = ({ items, activeElem, type }: types) => {
  return (
    <div
      className={classNames("notification container flex-right", {
        active: activeElem,
        hidden: activeElem !== true,
        "is-complain": type === "complain",
      })}
    >
      <div className="triangle"></div>
      <div className="wrapper-content container flex-left content-use">
        <div className="header container flex-space flex-row">
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
        </div>
        <div className="main container flex-left">
          {items?.map((item, i) => {
            const { title, text } = item;

            return (
              <div
                className="item container flex-left flex-row"
                key={`${item}__${i}`}
              >
                {type != "complain" && <div className="user-ico"></div>}
                <div className="content container width-auto">
                  <div className="title">
                    <p>{title}</p>
                  </div>
                  <div className="text">
                    <p>{text}</p>
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
