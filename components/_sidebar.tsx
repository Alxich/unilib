import React, { FC } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faClock,
  faNewspaper,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { NavElement } from "./elements";

// Importing Images
import rdr2 from "../public/images/navIcons/rdr2.png";
import cinima from "../public/images/navIcons/cinima.png";
import components from "../public/images/navIcons/components.png";
import gamedev from "../public/images/navIcons/gamedev.png";
import life from "../public/images/navIcons/life.png";
import industries from "../public/images/navIcons/industries.png";

const Sidebar: FC = () => {
  // List of usual user nav
  const fandomsLengthBefore = 5;
  const [openAllFandom, setOpenAllFandom] = React.useState(false);
  const [openAllThemes, setOpenAllThemes] = React.useState(false);

  const listOfNavUser: { icon: any; title: string }[] = [
    {
      icon: faFire,
      title: "Популярне",
    },
    {
      icon: faClock,
      title: "Нове у треді",
    },
    {
      icon: faNewspaper,
      title: "Моя стрічка",
    },
  ];

  // List of usual nav categories

  const listOfNavUsual: { icon: any; title: string }[] = [
    {
      icon: rdr2,
      title: "Ігри",
    },
    {
      icon: gamedev,
      title: "Gamedev",
    },
    {
      icon: components,
      title: "Залізо",
    },
    {
      icon: cinima,
      title: "Кіно та серіали",
    },
    {
      icon: industries,
      title: "Промисловість",
    },
    {
      icon: life,
      title: "Життя",
    },
    {
      icon: rdr2,
      title: "Ігри",
    },
    {
      icon: gamedev,
      title: "Gamedev",
    },
    {
      icon: components,
      title: "Залізо",
    },
    {
      icon: cinima,
      title: "Кіно та серіали",
    },
    {
      icon: industries,
      title: "Промисловість",
    },
    {
      icon: life,
      title: "Життя",
    },
  ];

  return (
    <div id="sidebar" className="container full-height flex-left to-left">
      <ul className="nav-user nav">
        {listOfNavUser.map((item, i) => (
          <NavElement
            key={`${item}__${i}`}
            iconTypeFaFont
            icon={item.icon}
            title={item.title}
          />
        ))}
      </ul>
      <ul className="nav-usual nav">
        {listOfNavUsual.map((item, i) =>
          openAllFandom ? (
            <NavElement
              key={`${item}__${i}`}
              iconTypeImage
              icon={item.icon}
              title={item.title}
            />
          ) : (
            i <= fandomsLengthBefore && (
              <NavElement
                key={`${item}__${i}`}
                iconTypeImage
                icon={item.icon}
                title={item.title}
              />
            )
          )
        )}
        <li
          className={classNames("open", {
            active: openAllFandom,
          })}
          onClick={() => {
            setOpenAllFandom(openAllFandom ? false : true);
          }}
        >
          <span>Відкрити усі фендоми</span>
          <div className="fafont-icon arrow-down">
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
        </li>
      </ul>
      <div className="nav nav-additional container flex-left to-left">
        <div className="change-theme item">
          <div className="title">
            <p>Тема:</p>
          </div>
          <div className="changer">
            <p onClick={() => setOpenAllThemes(openAllThemes ? false : true)}>
              Темна
            </p>
            <div
              className={classNames(
                "wrapper container flex-right flex-reverse-col width-auto",
                {
                  active: openAllThemes,
                }
              )}
            >
              <div className="triangle"></div>
              <div className="list container flex-left width-auto">
                <p>Світла</p>
                <p>Темна</p>
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <p>Повідомити про баг</p>
        </div>
        <div className="item">
          <p>Замовити рекламу</p>
        </div>
        <div className="item">
          <p>Про проект</p>
          <p>Правила</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
