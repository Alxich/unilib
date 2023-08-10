import {
  faBold,
  faCode,
  faImages,
  faItalic,
  faList,
  faListNumeric,
  faPaperPlane,
  faPlus,
  faStrikethrough,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor, FloatingMenu, BubbleMenu, EditorContent } from "@tiptap/react";
import classNames from "classnames";
import { Dispatch, FC, MouseEvent, SetStateAction, useCallback } from "react";
import Button from "../../_button";

type CommentFormProps = {
  editor: Editor;
  openImagePop: boolean;
  setOpenImagePop: Dispatch<SetStateAction<boolean>>;
  imagePopText: string;
  setImagePopText: Dispatch<SetStateAction<string>>;
  createFunction: () => Promise<void>;
};

const CommentForm: FC<CommentFormProps> = ({
  editor,
  createFunction,
  setOpenImagePop,
  openImagePop,
  imagePopText,
  setImagePopText,
}: CommentFormProps) => {
  const addImage = useCallback(
    (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e?.preventDefault();

      if (imagePopText) {
        editor?.chain().focus().setImage({ src: imagePopText }).run();
        setOpenImagePop(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, imagePopText]
  );

  return (
    <form className="comment tiptap">
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
      <button
        className="fafont-icon image interactive post-image"
        onClick={(e) => {
          e.preventDefault();
          setOpenImagePop(true);
        }}
      >
        <FontAwesomeIcon
          icon={faImages}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </button>
      <button
        className={classNames("fafont-icon send post-send", {
          interactive: editor.isEmpty !== true,
        })}
        onClick={(e) => {
          e.preventDefault();
          editor.isEmpty !== true && createFunction();
        }}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={{ width: "100%", height: "100%", color: "inherit" }}
        />
      </button>

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
    </form>
  );
};

export default CommentForm;
