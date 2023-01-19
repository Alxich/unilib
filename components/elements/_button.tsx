import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

interface buttonProps {
  onClick?: Function;
  className?: string;
  outline?: boolean;
  filled?: boolean;
  small?: boolean;
  big?: boolean;
  iconIncluded?: boolean;
  iconName?: any;
  children: never[] | any;
}

const Button = ({
  onClick,
  className,
  outline,
  filled,
  small,
  big,
  iconIncluded,
  iconName,
  children,
}: buttonProps): ReactElement => {
  return (
    <button
      onClick={() => onClick}
      className={classNames("button", {
        "awesome-icon": iconIncluded,
        filled: filled,
        outline: outline,
        small: small,
        big: big,
        className,
      })}
    >
      {iconIncluded && (
        <div className="fafont-icon">
          <FontAwesomeIcon
            icon={iconName}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
