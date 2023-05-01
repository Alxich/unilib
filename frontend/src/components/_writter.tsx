import { FC, useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";

import Editor from "./elements/_editor";
import { Button } from "./elements";

export interface IWritterPostProps {
  writterActive: boolean;
  setWritterActive: any;
}

const WritterPost: FC<IWritterPostProps> = ({
  writterActive,
  setWritterActive,
}: IWritterPostProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filterText, setFilterText] = useState("Мій блог");
  const [dateText, setDateText] = useState("");
  const [titleText, setTitleText] = useState("");

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        writterActive != false && setWritterActive(false);
      }
    },
    [setWritterActive, writterActive]
  );

  const returnMeDate = () => {
    const date = new Date();

    const monthNames = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const month = date.getMonth();
    const year = date.getFullYear();

    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setDateText(`${monthNames[month]} ${year} рік ${time}`);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    const timerId = setInterval(returnMeDate, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div id="writter" className={classNames({ active: writterActive })}>
      <div className="container full-width">
        <div className="head">
          <div
            className="fafont-icon big interactive cross"
            onClick={() => setWritterActive(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          <div className="container flex-row flex-space">
            <div className="lt-side">
              <div className="title">
                <h3>Створення нового поста</h3>
              </div>
              <div className="date">
                <p>{dateText}</p>
              </div>
            </div>
            <div className="rt-side">
              <div
                className="category"
                onClick={() => setOpenFilter(openFilter ? false : true)}
              >
                <p>{filterText}</p>
                <div className="changer open-more">
                  <div className="fafont-icon interactive">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "inherit",
                      }}
                    />
                  </div>
                  <div
                    className={classNames(
                      "wrapper container flex-right width-auto",
                      {
                        active: openFilter,
                      }
                    )}
                  >
                    <div className="triangle"></div>
                    <div className="list container flex-left width-auto">
                      <p
                        onClick={() => {
                          setFilterText("Мій блог");
                        }}
                      >
                        Мій блог
                      </p>
                      <p
                        onClick={() => {
                          setFilterText("Наука");
                        }}
                      >
                        Наука
                      </p>
                      <p
                        onClick={() => {
                          setFilterText("Ігри");
                        }}
                      >
                        Ігри
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button filled>Опублікувати</Button>
            </div>
          </div>
        </div>
        <div className="content">
          <form
            className="form container full-width"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="title"
              type="text"
              placeholder="Заголовок"
              value={capitalize(titleText)}
              onChange={(e) => setTitleText(e.target.value)}
            />
            {/* <textarea
              className="text"
              placeholder="Нажміть Tab для вибору інструмента"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
            /> */}
            <Editor />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritterPost;
