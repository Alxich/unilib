import { FC, useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { ObjectId } from "bson";
import toast from "react-hot-toast";

import { useMutation } from "@apollo/client";

import { Session } from "next-auth";

import PostsOperations from "../graphql/operations/posts";
import { CreatePostArguments } from "../util/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import EditorBlock from "./elements/_editor";

import { Button } from "./elements";

export interface IWritterPostProps {
  session: Session;
  writterActive: boolean;
  setWritterActive: any;
}

const WritterPost: FC<IWritterPostProps> = ({
  session,
  writterActive,
  setWritterActive,
}: IWritterPostProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filterText, setFilterText] = useState({
    title: "Мій блог",
    id: "123",
  });
  const [dateText, setDateText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [content, setContent] = useState(
    `<p>Вибиріть слово щоб його редагувати.</p>`
  );

  // Initialize tiptap editor

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      setContent(editor.getJSON());
    },
  });

  const returnMeDate = () => {
    const date = new Date();

    const monthNames = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const month = date.getMonth();
    const year = date.getFullYear();

    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setDateText(`${monthNames[month]} ${year} рік ${time}`);
  };

  // Helps to capitalize first letter in title

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // If user pressed esq clore our editor

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        writterActive != false && setWritterActive(false);
      }
    },
    [setWritterActive, writterActive]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    const timerId = setInterval(returnMeDate, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  // Starting working with backend and using hoo createPost

  const [createPost] = useMutation<
    { createPost: boolean },
    CreatePostArguments
  >(PostsOperations.Mutations.createPost);

  const onCreatePost = async () => {
    try {
      const { id: userID, username } = session.user;
      const newId = new ObjectId().toString();

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      if (!titleText || !content) {
        throw new Error("Error: Please fill all forms");
      }

      const post = {
        id: newId,
        title: titleText,
        content: JSON.stringify(content),
        authorId: userID,
        categoryId: filterText.id,
        tagsId: ["645cfdb3e5c882a2c163706f"],
      };

      const { data, errors } = await createPost({
        variables: {
          ...post,
        },
      });

      if (!data?.createPost || errors) {
        throw new Error("Error creating post");
      }

      if (!errors) {
        setContent("");
        setTitleText("");
        editor?.commands.setContent(
          `<p>Вибиріть слово щоб його редагувати.</p>`
        );
        setWritterActive(false);
        toast.success("Post was created!");
      }
    } catch (error: any) {
      console.log("onCreatePost error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div id="writter" className={classNames({ active: writterActive })}>
      <div className="container full-width">
        <div className="head">
          <div
            className="fafont-icon big interactive cross"
            onClick={() => setWritterActive(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          <div className="container flex-row flex-space">
            <div className="lt-side">
              <div className="title">
                <h3>Створення нового поста</h3>
              </div>
              <div className="date">
                <p>{dateText}</p>
              </div>
            </div>
            <div className="rt-side">
              <div
                className="category"
                onClick={() => setOpenFilter(openFilter ? false : true)}
              >
                <p>{filterText.title}</p>
                <div className="changer open-more">
                  <div className="fafont-icon interactive">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "inherit",
                      }}
                    />
                  </div>
                  <div
                    className={classNames(
                      "wrapper container flex-right width-auto",
                      {
                        active: openFilter,
                      }
                    )}
                  >
                    <div className="triangle"></div>
                    <div className="list container flex-left width-auto">
                      <p
                        onClick={() => {
                          setFilterText({ title: "Мій блог", id: "123" });
                        }}
                      >
                        Мій блог
                      </p>
                      <p
                        onClick={() => {
                          setFilterText({
                            title: "GameDev",
                            id: "645ce049f0a62838a0f9c857",
                          });
                        }}
                      >
                        GameDev
                      </p>
                      <p
                        onClick={() => {
                          setFilterText({ title: "Ігри", id: "123" });
                        }}
                      >
                        Ігри
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button filled onClick={() => onCreatePost()}>
                Опублікувати
              </Button>
            </div>
          </div>
        </div>
        <div className="content">
          <form
            className="form container full-width"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="title"
              type="text"
              placeholder="Заголовок"
              value={capitalize(titleText)}
              onChange={(e) => setTitleText(e.target.value)}
            />
            <EditorBlock editor={editor} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritterPost;
