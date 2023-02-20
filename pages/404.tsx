import Image from "next/image";
import { Content, Post } from "../components";

import image from "../public/images/404.png";

import { dehydrate, useQuery } from "react-query";
import { queryClient, getCategories, getFandoms } from "../src/api";

export async function getServerSideProps() {
  await queryClient.prefetchQuery("categories", () => getCategories());
  await queryClient.prefetchQuery("fandoms", () => getFandoms());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const FourOhFour = () => {
  const categories = useQuery(["categories"], () => getCategories());
  const fandoms = useQuery(["fandoms"], () => getFandoms());

  return (
    <Content
      categories={categories.data?.categories}
      fandoms={fandoms.data?.fandoms}
    >
      <Post
        id={0}
        group="UNILIB"
        name="Admin"
        time="00:00"
        title="404 - Сторінка не найдена"
        likesCount={0}
        commentsCount={0}
        isFailPage={true}
      >
        <p>
          Походу ви зайшли сюди помилково а можливо й спеціально (дивакувата ви
          людина), але вам досі доступний увесь контент на сайті тому просто
          оберіть фендом зліва або перейдіть у те що часто обговорюються
          сьогодні з справа.
        </p>
        <div className="image-holder container">
          <Image src={image} alt="404-image" />
        </div>
        <p>
          Тут ми вирішили прикипіти якусь цікаво картинку щоб ви зря час не
          витрачали. Хоча ви й так витрачаєте свій час...
        </p>
      </Post>
    </Content>
  );
};

export default FourOhFour;
