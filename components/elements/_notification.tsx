import Image from "next/image";
import classNames from "classnames";

const Notification = ({ activeElem }: { activeElem: boolean }) => {
  return (
    <div
      className={classNames("notification container flex-right", {
        active: activeElem,
        hidden: activeElem !== true,
      })}
    >
      <div className="triangle"></div>
      <div className="wrapper-content container flex-left content-use">
        <div className="header container flex-space flex-row">
          <div className="title">
            <h6>Усі повідомлення</h6>
          </div>
          <div className="actions container flex-center flex-row width-auto">
            <div className="item">
              <p>Відкрити усі</p>
            </div>
            <div className="item">
              <p>Очистити</p>
            </div>
          </div>
        </div>
        <div className="main container flex-left">
          <div className="item container flex-left flex-row">
            <div className="user-ico"></div>
            <div className="content container width-auto">
              <div className="title">
                <p>Шлях новачка у мікробіології: Купив ...</p>
              </div>
              <div className="text">
                <p>Ви отримали новий коментар у вашому пості ...</p>
              </div>
            </div>
          </div>
          <div className="item container flex-left flex-row">
            <div className="user-ico"></div>
            <div className="content container width-auto">
              <div className="title">
                <p>Шлях новачка у мікробіології: Купив ...</p>
              </div>
              <div className="text">
                <p>Ви отримали новий коментар у вашому пості ...</p>
              </div>
            </div>
          </div>
          <div className="item container flex-left flex-row">
            <div className="user-ico"></div>
            <div className="content container width-auto">
              <div className="title">
                <p>Шлях новачка у мікробіології: Купив ...</p>
              </div>
              <div className="text">
                <p>Ви отримали новий коментар у вашому пості ...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
