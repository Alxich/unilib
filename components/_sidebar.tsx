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

  const listOfNavUser: { icon: any; title: string; link: string }[] = [
    {
      icon: faFire,
      title: "Популярне",
      link: "/",
    },
    {
      icon: faClock,
      title: "Нове у треді",
      link: "new",
    },
    {
      icon: faNewspaper,
      title: "Моя стрічка",
      link: "myflow",
    },
  ];

  // List of usual nav categories

  const listOfNavUsual: { icon: any; title: string; link: string }[] = [
    {
      icon: rdr2,
      title: "Ігри",
      link: "games",
    },
    {
      icon: gamedev,
      title: "Gamedev",
      link: "gamedev",
    },
    {
      icon: components,
      title: "Залізо",
      link: "components",
    },
    {
      icon: cinima,
      title: "Кіно та серіали",
      link: "cinema",
    },
    {
      icon: industries,
      title: "Промисловість",
      link: "industries",
    },
    {
      icon: life,
      title: "Життя",
      link: "life",
    },
    {
      icon: rdr2,
      title: "Ігри",
      link: "games",
    },
    {
      icon: gamedev,
      title: "Gamedev",
      link: "gamedev",
    },
    {
      icon: components,
      title: "Залізо",
      link: "components",
    },
    {
      icon: cinima,
      title: "Кіно та серіали",
      link: "cinema",
    },
    {
      icon: industries,
      title: "Промисловість",
      link: "industries",
    },
    {
      icon: life,
      title: "Життя",
      link: "life",
    },
  ];

  return (
    <div id="sidebar" className="container full-height flex-left to-left">
      <div className="nav-user nav">
        {listOfNavUser.map((item, i) => (
          <NavElement
            key={`${item}__${i}`}
            iconTypeFaFont
            icon={item.icon}
            title={item.title}
            link={item.link}
          />
        ))}
      </div>
      <div className="nav-usual nav">
        {listOfNavUsual.map((item, i) =>
          openAllFandom ? (
            <NavElement
              key={`${item}__${i}`}
              iconTypeImage
              icon={item.icon}
              title={item.title}
              link={item.link}
            />
          ) : (
            i <= fandomsLengthBefore && (
              <NavElement
                key={`${item}__${i}`}
                iconTypeImage
                icon={item.icon}
                title={item.title}
                link={item.link}
              />
            )
          )
        )}
        <div
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
        </div>
      </div>
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
