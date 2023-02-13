import Image from "next/image";

import { Content, PostPage, Comments } from "../../components";

import postImage from "../../public/images/image-post.png";

const Post = () => {
  const postContent = {
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
          скло придбала, а ось предметні поки не дійшли (у місті не продаються).
          Всі препарати готував сам, вибачте за якість, згодом буде краще.
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
  };

  return (
    <Content>
      <div className="posts-container container">
        <PostPage
          group={postContent.group}
          name={postContent.name}
          time={postContent.time}
          title={postContent.title}
          tags={postContent.tags}
          likesCount={postContent.likesCount}
          commentsCount={postContent.commentsCount}
          viewsCount={postContent.viewsCount}
        >
          {postContent.content}
        </PostPage>
        <Comments />
      </div>
    </Content>
  );
};

export default Post;
