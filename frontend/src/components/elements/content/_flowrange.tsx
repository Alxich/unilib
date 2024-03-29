import { Dispatch, FC, SetStateAction, useState } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface FlowrangeProps {
  rangeValue: "year" | "today" | "week" | "month";
  setRangeValue: Dispatch<SetStateAction<"today" | "week" | "month" | "year">>;
}

const Flowrange: FC<FlowrangeProps> = ({
  rangeValue,
  setRangeValue,
}: FlowrangeProps) => {
  const [openRange, setOpenRange] = useState(false);

  // Function to format the current date into a specific format
  const formatDate = () => {
    const date = new Date();
    const day = date.getDate();
    const monthNames = [
      "Січня",
      "Лютого",
      "Березня",
      "Квітня",
      "Травня",
      "Червня",
      "Липня",
      "Серпня",
      "Вересня",
      "Жовтня",
      "Листопада",
      "Грудня",
    ];
    const month = monthNames[date.getMonth()];

    // Return formatted date as "day month"
    return `${day} ${month}`;
  };

  // Get the current year
  const year = new Date().getFullYear();

  // Initialize state variable `rangeText` with default value as `${year} Рік`
  const [rangeText, setRangeText] = useState<string>(`${year} Рік`);

  return (
    <div className="flow-range open-more">
      <p onClick={() => setOpenRange(openRange ? false : true)}>{rangeText}</p>
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
            {rangeValue !== "year" && (
              <p
                onClick={() => {
                  setRangeText(`${year} Рік`);
                  setRangeValue("year");
                  setOpenRange(false);
                }}
              >
                {year} Рік
              </p>
            )}
            {rangeValue !== "week" && (
              <p
                onClick={() => {
                  setRangeText("Тиждень");
                  setRangeValue("week");
                  setOpenRange(false);
                }}
              >
                Тиждень
              </p>
            )}
            {rangeValue !== "month" && (
              <p
                onClick={() => {
                  setRangeText("Місяць");
                  setRangeValue("month");
                  setOpenRange(false);
                }}
              >
                Місяць
              </p>
            )}
            {rangeValue !== "today" && (
              <p
                onClick={() => {
                  setRangeText(formatDate);
                  setRangeValue("today");
                  setOpenRange(false);
                }}
              >
                {formatDate()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flowrange;
