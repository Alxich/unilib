import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { NavElement } from "./elements";
import { CategoryPopulated } from "../../../backend/src/util/types";
import { ContentViewChanger, ContentViews } from "../util/types";
import Link from "next/link";
import { SidebarItemLoading } from "./skeletons";

interface SidebarProps {
  categories?: Array<ContentViewChanger>;
  fandoms?: Array<CategoryPopulated>;
  userSigned: boolean;
  setPeriod: Dispatch<SetStateAction<ContentViews>>;
  setBannerActive: Dispatch<SetStateAction<boolean>>;
  setBagReportActive: Dispatch<SetStateAction<boolean>>;
  loadingStatus: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  categories,
  fandoms,
  userSigned,
  setPeriod,
  setBannerActive,
  setBagReportActive,
  loadingStatus,
}: SidebarProps) => {
  const fandomsLengthBefore = 5;
  const [themeOption, setThemeOption] = useState(false); // False - black / True - white theme
  const [openAllFandom, setOpenAllFandom] = useState(false);
  const [openAllThemes, setOpenAllThemes] = useState(false);

  useEffect(() => {
    // True - white / false - black
    if (themeOption) {
      document.body.classList.add("white-themed");
      document.body.classList.remove("black-themed");
    } else {
      document.body.classList.add("black-themed");
      document.body.classList.remove("white-themed");
    }
  }, [themeOption]);

  return (
    <div id="sidebar" className="container full-height flex-left to-left">
      <div className="nav-user nav">
        {loadingStatus ? (
          <>
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
          </>
        ) : (
          categories?.map((item: any, i: number) =>
            item.link !== "follow" ? (
              <NavElement
                key={`${item}__${i}`}
                iconTypeFaFont
                icon={item.icon}
                title={item.title}
                link={item.link}
                setPeriod={setPeriod}
              />
            ) : (
              userSigned !== false && (
                <NavElement
                  key={`${item}__${i}`}
                  iconTypeFaFont
                  icon={item.icon}
                  title={item.title}
                  link={item.link}
                  setPeriod={setPeriod}
                />
              )
            )
          )
        )}
      </div>
      <div className="nav-usual nav">
        {loadingStatus ? (
          <>
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
            <SidebarItemLoading />
          </>
        ) : (
          fandoms?.map((item: CategoryPopulated, i: number) =>
            openAllFandom ? (
              <NavElement
                key={`${item}__${i}`}
                iconTypeImage
                icon={item.icon}
                title={item.title}
                link={`group/${item.id}`}
              />
            ) : (
              i <= fandomsLengthBefore && (
                <NavElement
                  key={`${item}__${i}`}
                  iconTypeImage
                  icon={item.icon}
                  title={item.title}
                  link={`group/${item.id}`}
                />
              )
            )
          )
        )}
        {!loadingStatus && fandoms && fandoms.length > 6 && (
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
              {themeOption ? "Світла" : "Темна"}
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
                <p
                  onClick={() => {
                    setThemeOption(themeOption ? false : true);
                    setOpenAllThemes(false);
                  }}
                >
                  {themeOption ? "Темна" : "Світла"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="item"
          onClick={() => {
            setBagReportActive(true);
            setBannerActive(true);
          }}
        >
          <p>Повідомити про баг</p>
        </div>
        <div className="item">
          <p>Замовити рекламу</p>
        </div>
        <div className="item">
          <Link href={"/post/about"}>Про проект</Link>
          <Link href={"/post/rules"}>Правила</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
