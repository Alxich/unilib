import Image, { StaticImageData } from "next/image";
import { FC } from "react";

type OhfailPageProps = {
  image: StaticImageData;
  text: string;
};

const OhfailPage: FC<OhfailPageProps> = ({ image, text }: OhfailPageProps) => {
  return (
    <div id="fail-page">
      <div className="image">
        <Image src={image} alt="fail-page-image" />
      </div>
      <div className="text-block">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default OhfailPage;
