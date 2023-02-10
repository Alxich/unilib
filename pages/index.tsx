import React from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Banner,
  Content,
  Flowrange,
  Header,
  Newestflow,
  Post,
  Reels,
  Sidebar,
  AuthorInfo,
  MoreAuthor,
  PostPage,
  Comments,
} from "../components";

import postImage from "../public/images/image-post.png";

export default function Home() {
  const [bannerActive, setBannerActive] = React.useState(false);

  const postsArray = [
    {
      group: "Научпоп",
      name: "Кирило Туров",
      time: "12:31",
      title: "Шлях новачка у мікробіології: купив мікроскоп",
      likesCount: 256,
      commentsCount: 256,
      viewsCount: 1340,
      tags: ["#Наука", "#2023"],
      content: [
        <>
          <p>
            Всім привіт. На свій день народження нарешті дозволив собі купити
            мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли друзі,
            дружина, робота. Але ось невдача, зовсім забув взяти предметні та
            покривні шибки. Так що якість фотографій поки що середня - покривне
            скло придбала, а ось предметні поки не дійшли (у місті не
            продаються). Всі препарати готував сам, вибачте за якість, згодом
            буде краще.
          </p>
          <div className="image-holder container">
            <Image src={postImage} alt="post-image-holder" />
          </div>
          <p>
            Цибуля класична. 640x(правда пізніше я дізнався, що його краще
            замочити ненадовго в йоді - тоді і клітини та ядра буде видно краще.
            Виправлюсь пізніше).
          </p>
        </>,
      ],
    },
    {
      group: "Научпоп",
      name: "Кирило Туров",
      time: "12:31",
      title: "Шлях новачка у мікробіології: купив мікроскоп",
      likesCount: 256,
      commentsCount: 256,
      viewsCount: 1340,
      tags: ["#Наука", "#2023"],
      content: [
        <>
          <p>
            Всім привіт. На свій день народження нарешті дозволив собі купити
            мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли друзі,
            дружина, робота. Але ось невдача, зовсім забув взяти предметні та
            покривні шибки. Так що якість фотографій поки що середня - покривне
            скло придбала, а ось предметні поки не дійшли (у місті не
            продаються). Всі препарати готував сам, вибачте за якість, згодом
            буде краще.
          </p>
          <div className="image-holder container">
            <Image src={postImage} alt="post-image-holder" />
          </div>
          <p>
            Цибуля класична. 640x(правда пізніше я дізнався, що його краще
            замочити ненадовго в йоді - тоді і клітини та ядра буде видно краще.
            Виправлюсь пізніше).
          </p>
        </>,
      ],
    },
    {
      group: "Научпоп",
      name: "Кирило Туров",
      time: "12:31",
      title: "Шлях новачка у мікробіології: купив мікроскоп",
      likesCount: 256,
      commentsCount: 256,
      viewsCount: 1340,
      tags: ["#Наука", "#2023"],
      content: [
        <>
          <p>
            Всім привіт. На свій день народження нарешті дозволив собі купити
            мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли друзі,
            дружина, робота. Але ось невдача, зовсім забув взяти предметні та
            покривні шибки. Так що якість фотографій поки що середня - покривне
            скло придбала, а ось предметні поки не дійшли (у місті не
            продаються). Всі препарати готував сам, вибачте за якість, згодом
            буде краще.
          </p>
          <div className="image-holder container">
            <Image src={postImage} alt="post-image-holder" />
          </div>
          <p>
            Цибуля класична. 640x(правда пізніше я дізнався, що його краще
            замочити ненадовго в йоді - тоді і клітини та ядра буде видно краще.
            Виправлюсь пізніше).
          </p>
        </>,
      ],
    },
    {
      group: "Научпоп",
      name: "Кирило Туров",
      time: "12:31",
      title: "Шлях новачка у мікробіології: купив мікроскоп",
      likesCount: 256,
      commentsCount: 256,
      viewsCount: 1340,
      tags: ["#Наука", "#2023"],
      content: [
        <>
          <p>
            Всім привіт. На свій день народження нарешті дозволив собі купити
            мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли друзі,
            дружина, робота. Але ось невдача, зовсім забув взяти предметні та
            покривні шибки. Так що якість фотографій поки що середня - покривне
            скло придбала, а ось предметні поки не дійшли (у місті не
            продаються). Всі препарати готував сам, вибачте за якість, згодом
            буде краще.
          </p>
          <div className="image-holder container">
            <Image src={postImage} alt="post-image-holder" />
          </div>
          <p>
            Цибуля класична. 640x(правда пізніше я дізнався, що його краще
            замочити ненадовго в йоді - тоді і клітини та ядра буде видно краще.
            Виправлюсь пізніше).
          </p>
        </>,
      ],
    },
    {
      group: "Научпоп",
      name: "Кирило Туров",
      time: "12:31",
      title: "Шлях новачка у мікробіології: купив мікроскоп",
      likesCount: 256,
      commentsCount: 256,
      viewsCount: 1340,
      tags: ["#Наука", "#2023"],
      content: [
        <>
          <p>
            Всім привіт. На свій день народження нарешті дозволив собі купити
            мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли друзі,
            дружина, робота. Але ось невдача, зовсім забув взяти предметні та
            покривні шибки. Так що якість фотографій поки що середня - покривне
            скло придбала, а ось предметні поки не дійшли (у місті не
            продаються). Всі препарати готував сам, вибачте за якість, згодом
            буде краще.
          </p>
          <div className="image-holder container">
            <Image src={postImage} alt="post-image-holder" />
          </div>
          <p>
            Цибуля класична. 640x(правда пізніше я дізнався, що його краще
            замочити ненадовго в йоді - тоді і клітини та ядра буде видно краще.
            Виправлюсь пізніше).
          </p>
        </>,
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>UNILIB - Ukrainian forum</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header setBannerActive={setBannerActive} />
      <main className={"main"}>
        <div className="container main-content flex-row flex-space">
          <Sidebar />
          <Content>
            <Flowrange />
            <Newestflow />
            {/* <AuthorInfo />
            <MoreAuthor /> */}
            {/* <div className="posts-container container">
              <PostPage
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                tags={["#Наука", "#2023"]}
                likesCount={256}
                commentsCount={256}
                viewsCount={1340}
              >
                <p>
                  Всім привіт. На свій день народження нарешті дозволив собі
                  купити мікроскоп. Простий, аматорський – Мікромед Р-1.
                  Допомогли друзі, дружина, робота. Але ось невдача, зовсім
                  забув взяти предметні та покривні шибки. Так що якість
                  фотографій поки що середня - покривне скло придбала, а ось
                  предметні поки не дійшли (у місті не продаються). Всі
                  препарати готував сам, вибачте за якість, згодом буде краще.
                </p>
                <div className="image-holder container">
                  <Image src={postImage} alt="post-image-holder" />
                </div>
                <p>
                  Цибуля класична. 640x(правда пізніше я дізнався, що його краще
                  замочити ненадовго в йоді - тоді і клітини та ядра буде видно
                  краще. Виправлюсь пізніше).
                </p>
              </PostPage>
              <Comments />
            </div> */}
            <div className="posts-container container">
              {postsArray.map((item, i) => {
                const {
                  group,
                  name,
                  time,
                  title,
                  likesCount,
                  commentsCount,
                  content,
                } = item;

                return (
                  <Post
                    key={`${item}__${i}`}
                    group={group}
                    name={name}
                    time={time}
                    title={title}
                    likesCount={likesCount}
                    commentsCount={commentsCount}
                  >
                    {content}
                  </Post>
                );
              })}
            </div>
          </Content>
          <Reels />
        </div>
      </main>
      <Banner bannerActive={bannerActive} setBannerActive={setBannerActive} />
      <footer className={"colophon"}></footer>
    </>
  );
}
