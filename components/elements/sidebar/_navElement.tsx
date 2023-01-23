import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import Image from "next/image";

interface buttonProps {
  icon?: any;
  title?: string;
  iconTypeImage?: boolean;
  iconTypeFaFont?: boolean;
}

const NavElement = ({
  icon,
  title,
  iconTypeImage,
  iconTypeFaFont,
}: buttonProps): ReactElement => {
  return (
    <li key={`${title}__${icon}`} className="item container flex-row flex-left">
      <div className="fafont-icon big interactive">
        {iconTypeFaFont ? (
          <FontAwesomeIcon
            icon={icon}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        ) : (
          iconTypeImage && (
            <Image className="image" src={icon} alt="navigationImage" />
          )
        )}
      </div>
      <div className="title">
        <p>{title}</p>
      </div>
    </li>
  );
};

export default NavElement;
