import { FC } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faFire,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

interface NavElementProps {
  icon?: any;
  title?: string;
  iconTypeImage?: boolean;
  iconTypeFaFont?: boolean;
  link: string;
}

const NavElement: FC<NavElementProps> = ({
  icon,
  title,
  iconTypeImage,
  iconTypeFaFont,
  link,
}: NavElementProps) => {
  const router = useRouter();

  const scroolToTop = (e: any, link: string) => {
    if (router.pathname === "/" && link === "/") {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const iconsFontAwesome: any = {
    faFire: faFire,
    faClock: faClock,
    faNewspaper: faNewspaper,
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
            icon={iconsFontAwesome[icon]}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        ) : (
          iconTypeImage && (
            <Image
              className="image"
              src={icon}
              alt="navigationImage"
              height={100}
              width={100}
            />
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
