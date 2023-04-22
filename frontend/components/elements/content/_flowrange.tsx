import React, { FC } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Flowrange = () => {
  const [openRange, setOpenRange] = React.useState(false);

  return (
    <div className="flow-range open-more">
      <p onClick={() => setOpenRange(openRange ? false : true)}>3 cічня</p>
      <div className="changer">
        <div
          className="fafont-icon arrow-down"
          onClick={() => setOpenRange(openRange ? false : true)}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
        <div
          className={classNames("wrapper container flex-right width-auto", {
            active: openRange,
          })}
        >
          <div className="triangle"></div>
          <div className="list container flex-left width-auto">
            <p>Тиждень</p>
            <p>Місяць</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flowrange;
