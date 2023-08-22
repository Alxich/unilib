import { FC, useState, useCallback, Dispatch, SetStateAction } from "react";
import classNames from "classnames";

import { BubbleMenu, EditorContent, FloatingMenu } from "@tiptap/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faCode,
  faImage,
  faItalic,
  faList,
  faListNumeric,
  faPlus,
  faStrikethrough,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";

import { Button } from "../elements";
import TagEdit from "./editor/_tagEdit";

import { TagArguments } from "../../util/types";

interface EditorProps {
  editor: any;
  session: Session | null;
  tags: TagArguments[] | undefined;
  setTags: Dispatch<SetStateAction<TagArguments[] | undefined>>;
}

const EditorBlock: FC<EditorProps> = ({
  editor,
  session,
  tags,
  setTags,
}: EditorProps) => {
  const [openImagePop, setOpenImagePop] = useState(false);
  const [imagePopText, setImagePopText] = useState("");

  // Callback function to add an image to the editor's content
  const addImage = useCallback(() => {
    if (imagePopText) {
      // Chain commands to focus on the editor, set the image source, and run the commands
      editor?.chain().focus().setImage({ src: imagePopText }).run();
      setOpenImagePop(false); // Close the image popup after adding the image
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, imagePopText]);

  if (!editor) {
    return null;
  }

  return (
    <>
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
                setOpenImagePop(true);
              }}
              className={editor.isActive("image") ? "is-active" : ""}
            >
              <div className="fafont-icon interactive undermain">
                <FontAwesomeIcon
                  icon={faImage}
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
            onChange={(e) => {
              setImagePopText(e.target.value);
            }}
          />
          <Button
            outline
            filled
            disabled={imagePopText.length > 0 ? false : true}
            onClick={() => addImage()}
          >
            Підвердити
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
      <TagEdit session={session} tags={tags} setTags={setTags} />
    </>
  );
};

export default EditorBlock;
