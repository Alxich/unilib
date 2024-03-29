import {
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import classNames from "classnames";
import { ObjectId } from "bson";
import { toast } from "react-toastify";

import { Session } from "next-auth";

import { useMutation, useQuery } from "@apollo/client";
import PostsOperations from "../graphql/operations/posts";
import CategoriesOperations from "../graphql/operations/categories";

import {
  CategoriesData,
  CreatePostArguments,
  TagArguments,
} from "../util/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import EditorBlock from "./elements/_editor";

import { Button } from "./elements";

import { useEscapeClose } from "../util/functions/useEscapeClose";
import { returnMeDate } from "../util/functions/returnMeDate";

export interface IWritterPostProps {
  session: Session;
  writterActive: boolean;
  setWritterActive: any;
  writterAdminActive: boolean;
  setWritterAdminActive: Dispatch<SetStateAction<boolean>>;
}

const WritterPost: FC<IWritterPostProps> = ({
  session,
  writterActive,
  setWritterActive,
  writterAdminActive,
  setWritterAdminActive,
}: IWritterPostProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filterText, setFilterText] = useState({
    title: "",
    id: "",
  });
  const [dateText, setDateText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [content, setContent] = useState(
    `<p>Вибиріть слово щоб його редагувати.</p>`
  );
  const [tags, setTags] = useState<TagArguments[] | undefined>([]);

  // Initialize tiptap editor

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      setContent(editor.getJSON());
    },
  });

  // Format date in a specific way

  const returnMeSpecificData = () => {
    setDateText(returnMeDate("ua"));
  };

  useEffect(() => {
    const timerId = setInterval(returnMeSpecificData, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  // Helps to capitalize first letter in title

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  /**
   * Using useEscapeClose function to close the element
   */

  useEscapeClose({
    activeElem: writterActive,
    setActiveElem: setWritterActive,
  });

  useEscapeClose({
    activeElem: writterAdminActive,
    setActiveElem: setWritterAdminActive,
  });

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
        tagsId: tags,
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
        setTags([]);
        editor?.commands.setContent(
          `<p>Вибиріть слово щоб його редагувати.</p>`
        );
        setWritterActive(false);
        setWritterAdminActive(false);
        toast.success("Post was created!");
      }
    } catch (error: any) {
      console.error("onCreatePost error", error);
      toast.error(error?.message);
    }
  };

  // UseQuery hook to fetch categories

  const { data: categories, loading: categoriesLoading } =
    useQuery<CategoriesData>(CategoriesOperations.Queries.queryCategories);

  useEffect(() => {
    if (!categoriesLoading && categories) {
      const item = categories?.queryCategories[0];

      item &&
        setFilterText({
          title: item.title,
          id: item.id,
        });
    }
  }, [categoriesLoading]);

  return categoriesLoading ? (
    <></>
  ) : (
    <div id="writter" className={classNames({ active: writterActive })}>
      <div className="container full-width full-height">
        <div className="head">
          <div
            className="fafont-icon big interactive cross"
            onClick={() => {
              setWritterActive(false);
              setWritterAdminActive(false);
            }}
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
                className={classNames("category", {
                  empty:
                    categories?.queryCategories &&
                    categories?.queryCategories.length <= 0,
                })}
                onClick={() =>
                  categories?.queryCategories &&
                  categories?.queryCategories.length > 0 &&
                  setOpenFilter(openFilter ? false : true)
                }
              >
                <p>
                  {categories?.queryCategories &&
                  categories?.queryCategories.length
                    ? filterText.title
                    : "Немає категорій - створіть нові"}
                </p>
                {categories?.queryCategories &&
                  categories?.queryCategories.length > 0 && (
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
                          {categories?.queryCategories.map((item, i) => {
                            return (
                              <p
                                key={`${item}___${i}`}
                                onClick={() => {
                                  setFilterText({
                                    title: item.title,
                                    id: item.id,
                                  });
                                  setOpenFilter(false);
                                }}
                              >
                                {item.title}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <Button filled onClick={() => onCreatePost()}>
                Опублікувати
              </Button>
            </div>
          </div>
        </div>
        <div className="content">
          <form
            className="form container full-width tiptap"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="title"
              type="text"
              placeholder="Заголовок"
              value={capitalize(titleText)}
              onChange={(e) => setTitleText(e.target.value)}
            />
            <EditorBlock
              editor={editor}
              session={session}
              tags={tags}
              setTags={setTags}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritterPost;
