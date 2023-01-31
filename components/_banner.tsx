import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Registration, UsualIntro } from "./elements/banner";

const Banner = ({
  bannerActive,
  setBannerActive,
}: {
  bannerActive: boolean;
  setBannerActive: any;
}) => {
  return (
    <div
      id="banner"
      className={classNames({
        active: bannerActive,
      })}
    >
      <div className="background"></div>
      <div className="wrapper container">
        <div
          className="fafont-icon big interactive cross"
          onClick={() => setBannerActive(false)}
        >
          <FontAwesomeIcon
            icon={faXmark}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
        <div className="logo">
          <p>unilib</p>
        </div>
        <Registration />
      </div>
    </div>
  );
};

export default Banner;
