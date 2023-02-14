import { ReactElement } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

interface buttonProps {
  icon?: any;
  title?: string;
  iconTypeImage?: boolean;
  iconTypeFaFont?: boolean;
  link: string;
}

const NavElement = ({
  icon,
  title,
  iconTypeImage,
  iconTypeFaFont,
  link,
}: buttonProps): ReactElement => {
  const router = useRouter();

  const scroolToTop = (e: any, link: string) => {
    if (router.pathname === "/" && link === "/") {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href={link != "/" ? "/" + link : link}
      key={`${title}__${icon}`}
      className={classNames("item container flex-row flex-left", {
        active: router.asPath === link ? true : router.asPath === "/" + link,
      })}
      onClick={(e) => scroolToTop(e, link)}
    >
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
    </Link>
  );
};

export default NavElement;
