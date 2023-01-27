import Head from "next/head";
import {
  Content,
  Flowrange,
  Header,
  Newestflow,
  Post,
  Reels,
  Sidebar,
} from "../components";

export default function Home() {
  return (
    <>
      <Head>
        <title>UNILIB - Ukrainian forum</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={"main"}>
        <div className="container main-content flex-row flex-space">
          <Sidebar />
          <Content>
            <Flowrange />
            <Newestflow />
            <div className="posts-container container">
              <Post
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                likesCount={256}
                commentsCount={256}
              >
                Всім привіт. На свій день народження нарешті дозволив собі
                купити мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли
                друзі, дружина, робота. Але ось невдача, зовсім забув взяти
                предметні та покривні шибки. Так що якість фотографій поки що
                середня - покривне скло придбала, а ось предметні поки не дійшли
                (у місті не продаються). Всі препарати готував сам, вибачте за
                якість, згодом буде краще.
              </Post>
              <Post
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                likesCount={256}
                commentsCount={256}
              >
                Всім привіт. На свій день народження нарешті дозволив собі
                купити мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли
                друзі, дружина, робота. Але ось невдача, зовсім забув взяти
                предметні та покривні шибки. Так що якість фотографій поки що
                середня - покривне скло придбала, а ось предметні поки не дійшли
                (у місті не продаються). Всі препарати готував сам, вибачте за
                якість, згодом буде краще.
              </Post>
              <Post
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                likesCount={256}
                commentsCount={256}
              >
                Всім привіт. На свій день народження нарешті дозволив собі
                купити мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли
                друзі, дружина, робота. Але ось невдача, зовсім забув взяти
                предметні та покривні шибки. Так що якість фотографій поки що
                середня - покривне скло придбала, а ось предметні поки не дійшли
                (у місті не продаються). Всі препарати готував сам, вибачте за
                якість, згодом буде краще.
              </Post>
              <Post
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                likesCount={256}
                commentsCount={256}
              >
                Всім привіт. На свій день народження нарешті дозволив собі
                купити мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли
                друзі, дружина, робота. Але ось невдача, зовсім забув взяти
                предметні та покривні шибки. Так що якість фотографій поки що
                середня - покривне скло придбала, а ось предметні поки не дійшли
                (у місті не продаються). Всі препарати готував сам, вибачте за
                якість, згодом буде краще.
              </Post>
              <Post
                group="Научпоп"
                name="Кирило Туров"
                time="12:31"
                title="Шлях новачка у мікробіології: купив мікроскоп"
                likesCount={256}
                commentsCount={256}
              >
                Всім привіт. На свій день народження нарешті дозволив собі
                купити мікроскоп. Простий, аматорський – Мікромед Р-1. Допомогли
                друзі, дружина, робота. Але ось невдача, зовсім забув взяти
                предметні та покривні шибки. Так що якість фотографій поки що
                середня - покривне скло придбала, а ось предметні поки не дійшли
                (у місті не продаються). Всі препарати готував сам, вибачте за
                якість, згодом буде краще.
              </Post>
            </div>
          </Content>
          <Reels />
        </div>
      </main>
      <footer className={"colophon"}></footer>
    </>
  );
}
