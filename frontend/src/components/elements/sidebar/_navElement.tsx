import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faFire,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

import { ContentViews } from "../../../util/types";

interface NavElementProps {
  icon?: any;
  title?: string;
  iconTypeImage?: boolean;
  iconTypeFaFont?: boolean;
  link: string;
  setPeriod?: Dispatch<SetStateAction<ContentViews>>;
}

const NavElement: FC<NavElementProps> = ({
  icon,
  title,
  iconTypeImage,
  iconTypeFaFont,
  link,
  setPeriod,
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
      href={
        iconTypeFaFont
          ? router.pathname !== "/"
            ? "/"
            : "/"
          : link != "/"
          ? "/" + link
          : link
      }
      key={`${title}__${icon}`}
      className={classNames("item container flex-row flex-left", {
        active: router.asPath === link ? true : router.asPath === "/" + link,
      })}
      onClick={(e) => {
        if (iconTypeFaFont && setPeriod) {
          router.pathname === "/" && e.preventDefault();
          setPeriod(link as ContentViews);
        }
        scroolToTop(e, link);
      }}
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
