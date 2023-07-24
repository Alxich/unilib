import type { NextPage } from "next";
import Image from "next/image";

import { Post } from "../components";

import image from "../../public/images/404.png";
import { PostFail } from "../../src/util/types";

const FourOhFour: NextPage = () => {
  const data: PostFail = {
    title: "404 - Сторінка не найдена",
  };

  return (
    <Post data={data} isFailPage session={null}>
      <p>
        Походу ви зайшли сюди помилково а можливо й спеціально (дивакувата ви
        людина), але вам досі доступний увесь контент на сайті тому просто
        оберіть фендом зліва або перейдіть у те що часто обговорюються сьогодні
        з справа.
      </p>

      <Image src={image} alt="404-image" />

      <p>
        Тут ми вирішили прикипіти якусь цікаво картинку щоб ви зря час не
        витрачали. Хоча ви й так витрачаєте свій час...
      </p>
    </Post>
  );
};

export default FourOhFour;
