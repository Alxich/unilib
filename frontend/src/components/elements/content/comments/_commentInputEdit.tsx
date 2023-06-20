import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { toast } from "react-hot-toast";

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

import Button from "../../_button";

import { useMutation } from "@apollo/client";
import { Session } from "next-auth";
import CommentOperations from "../../../../graphql/operations/comments";
import {
  Comment,
  CommentEditInteractionArguments,
} from "../../../../util/types";
import { CommentPopulated } from "../../../../../../backend/src/util/types";

interface CommentInputProps {
  session?: Session | null;
  id: string;
  authorId: string;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setCommentData: Dispatch<SetStateAction<CommentPopulated>>;
  setEditActive: Dispatch<SetStateAction<boolean>>;
}

const CommentInputEdit: FC<CommentInputProps> = ({
  session,
  id,
  authorId,
  content,
  setContent,
  setCommentData,
  setEditActive,
}: CommentInputProps) => {
  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Написати свій коментар ...",
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

  const [editComment] = useMutation<
    { editComment: CommentPopulated },
    CommentEditInteractionArguments
  >(CommentOperations.Mutations.editComment, {
    onError: (error) => {
      console.error("editComment error", error);
      toast.error("Error occurred while editing the comment");
    },
    onCompleted: (data) => {
      if (data.editComment) {
        // Update the component's state or trigger a refetch to update the data
        setCommentData(data.editComment);

        toast.success("Comment was edited!");
      } else {
        toast.error("Failed to edit the comment");
      }
    },
  });

  const onEditComment = async () => {
    /**
     * This func allow author to delete a comment
     * It will not delete at all but change the content
     */
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if user exist to make comment secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      //Check if author id same as user id
      if (authorId !== session?.user.id) {
        throw new Error("You are not the author!");
      }

      const { data, errors } = await editComment({
        variables: {
          id: id,
          text: JSON.stringify(content),
        },
      });

      if (!data?.editComment || errors) {
        throw new Error("Error onEditComment when trying to edit");
      }

      if (!errors) {
        toast.success("Comment was edited!");
        setEditActive(false);
      }
    } catch (error: any) {
      console.error("onEditComment error", error);
      toast.error(error?.message);
    }
  };

  // If user pressed esq clore our editor

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditActive(false);
      }
    },
    [setEditActive]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  if (!editor) {
    return null;
  }

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
          editor.isEmpty !== true && onEditComment();
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

export default CommentInputEdit;
