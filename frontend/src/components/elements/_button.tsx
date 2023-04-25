import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

interface buttonProps {
  onClick?: () => void;
  className?: string;
  outline?: boolean;
  filled?: boolean;
  form?: boolean;
  small?: boolean;
  big?: boolean;
  fullWidth?: boolean;
  iconIncluded?: boolean;
  iconName?: any;
  loading?: boolean;
  disabled?: boolean;
  children: never[] | any;
}

const Button: FC<buttonProps> = ({
  onClick,
  className,
  outline,
  filled,
  form,
  small,
  big,
  fullWidth,
  iconIncluded,
  iconName,
  loading,
  disabled,
  children,
}: buttonProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames("button", {
        "awesome-icon": iconIncluded,
        filled: filled,
        outline: outline,
        small: small,
        big: big,
        className,
        form: form,
        loading: loading,
        disabled: disabled,
        "full-width": fullWidth,
      })}
    >
      {loading ? (
        <div className="loading-circle"></div>
      ) : iconIncluded ? (
        <>
          <div className="fafont-icon">
            <FontAwesomeIcon
              icon={iconName}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
