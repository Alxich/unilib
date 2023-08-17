import {
  FC,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from "react";
import classNames from "classnames";

import {
  faBold,
  faItalic,
  faStrikethrough,
  faPlus,
  faList,
  faListNumeric,
  faCode,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Placeholder from "@tiptap/extension-placeholder";
import {
  useEditor,
  BubbleMenu,
  FloatingMenu,
  EditorContent,
} from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

import Button from "../_button";

interface PostEditProps {
  content: string;
  setContent: (content: string) => void;
}

const PostEdit: FC<PostEditProps> = ({
  content,
  setContent,
}: PostEditProps) => {
  // Initialize the editor with start-up config

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Написати повідомлення ...",
        showOnlyCurrent: true,
      }),
    ],
    injectCSS: false,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      setContent(editor.getJSON());
    },
  });

  const [openImagePop, setOpenImagePop] = useState(false);
  const [imagePopText, setImagePopText] = useState("");

  const addImage = useCallback(
    (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e?.preventDefault();

      if (imagePopText) {
        editor?.chain().focus().setImage({ src: imagePopText }).run();
        setOpenImagePop(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [editor, imagePopText]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="edit-post-content tiptap">
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <div className="fafont-icon interactive undermain">
              <FontAwesomeIcon
                icon={faBold}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <div className="fafont-icon interactive undermain">
              <FontAwesomeIcon
                icon={faItalic}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <div className="fafont-icon interactive undermain">
              <FontAwesomeIcon
                icon={faStrikethrough}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="fafont-icon">
            <FontAwesomeIcon
              icon={faPlus}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          <div className="container flex-row flex-center width-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <div className="fafont-icon interactive undermain">
                <FontAwesomeIcon
                  icon={faList}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <div className="fafont-icon interactive undermain">
                <FontAwesomeIcon
                  icon={faListNumeric}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleCode().run();
              }}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <div className="fafont-icon interactive undermain">
                <FontAwesomeIcon
                  icon={faCode}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </button>
          </div>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} />
      <div
        className={classNames("pop-up-messanger container flex-center", {
          active: openImagePop,
        })}
      >
        <div className="wrapper container">
          <div
            className="fafont-icon interactive cross"
            onClick={() => setOpenImagePop(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
          <div className="title">
            <h4>Добавлення зоображення</h4>
          </div>
          <input
            placeholder="Веддіть URL-посилання"
            value={imagePopText}
            onChange={(e) => setImagePopText(e.target.value)}
          />
          <Button
            outline
            filled
            disabled={imagePopText.length > 0 ? false : true}
            onClick={addImage}
          >
            Підвердити
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
