import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBell } from "@fortawesome/free-solid-svg-icons";

import { Button, Notification } from "./elements";

const Header = ({
  setBannerActive,
}: {
  setBannerActive: any;
}): ReactElement => {
  const [activeNotify, setActiveNotfiy] = React.useState(false);
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

  return (
    <header className="masthead">
      <div className="container full-height flex-space flex-row content-pad">
        <div className="logo">
          <p>UNILIB</p>
        </div>
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
        <div className="user-action container full-height flex-row not-logged width-auto">
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
          <Button filled onClick={() => setBannerActive(true)}>
            Увійти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
