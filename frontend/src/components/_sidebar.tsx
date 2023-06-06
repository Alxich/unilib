import React, { FC } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { NavElement } from "./elements";
import { CategoryPopulated } from "../../../backend/src/util/types";

interface SidebarProps {
  categories?: Array<CategoryPopulated>;
  fandoms?: Array<CategoryPopulated>;
}

const Sidebar: FC<SidebarProps> = ({ categories, fandoms }: SidebarProps) => {
  const fandomsLengthBefore = 5;
  const [openAllFandom, setOpenAllFandom] = React.useState(false);
  const [openAllThemes, setOpenAllThemes] = React.useState(false);

  return (
    <div id="sidebar" className="container full-height flex-left to-left">
      <div className="nav-user nav">
        {categories?.map((item: any, i: number) => (
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
        {fandoms?.map((item: CategoryPopulated, i: number) =>
          openAllFandom ? (
            <NavElement
              key={`${item}__${i}`}
              iconTypeImage
              icon={item.icon}
              title={item.title}
              link={`${item.id}`}
            />
          ) : (
            i <= fandomsLengthBefore && (
              <NavElement
                key={`${item}__${i}`}
                iconTypeImage
                icon={item.icon}
                title={item.title}
                link={`${item.id}`}
              />
            )
          )
        )}
        {fandoms && fandoms.length > 6 && (
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
        )}
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
