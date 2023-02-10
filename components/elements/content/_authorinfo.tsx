import React from "react";
import classNames from "classnames";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";

import background from "../../../public/images/background.png";

const AuthorInfo = () => {
  const [openFilter, setOpenFilter] = React.useState(false);

  return (
    <div id="author-info" className="container">
      <div className="banner">
        <Image src={background} alt="author-background" />
      </div>
      <div className="info post-wrapper">
        <div className="icon"></div>
        <div className="name">
          <h2>Научпоп</h2>
        </div>
        <div className="disription">
          <p>Наукове співтовариство на DTF. Доступно – про складне.</p>
        </div>
        <div className="author-counters">
          <div className="item">
            <div className="count">
              <p>58 110</p>
            </div>
            <div className="title">
              <p>стежувачів</p>
            </div>
          </div>
          <div className="item">
            <div className="count">
              <p>110</p>
            </div>
            <div className="title">
              <p>стежує</p>
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="list-of-actions">
            <div className="item active">
              <p>Записів</p>
            </div>
            <div className="item">
              <p>Коментарі</p>
            </div>
            <div className="item">
              <p>Більше</p>
            </div>
          </div>
          <div className="changer filter open-more">
            <div className="fafont-icon interactive">
              <FontAwesomeIcon
                onClick={() => setOpenFilter(openFilter ? false : true)}
                icon={faAlignCenter}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div
              className={classNames("wrapper container flex-right width-auto", {
                active: openFilter,
              })}
            >
              <div className="triangle"></div>
              <div className="list container flex-left width-auto">
                <p>По даті</p>
                <p>По популярності</p>
                <p>За рейтингом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
