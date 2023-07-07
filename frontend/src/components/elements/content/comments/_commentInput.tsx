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
  CommentCreateArguments,
  CommentCreateVariables,
} from "../../../../util/types";

interface CommentInputProps {
  session?: Session | null;
  postId?: string;
  parentId?: string | null;
  setAnswerShowActive?: Dispatch<SetStateAction<boolean>>;
  subscribeToMoreComments?: (postId: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({
  session,
  postId,
  parentId,
  subscribeToMoreComments,
  setAnswerShowActive,
}: CommentInputProps) => {
  const [content, setContent] = useState("");

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

  const [createComment] = useMutation<
    { createComment: CommentCreateArguments },
    CommentCreateVariables
  >(CommentOperations.Mutations.createComment);

  const onCreateComment = async () => {
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }
      const { username, id: userId } = session.user;

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if string not empty
      if (editor === null || editor.isEmpty) {
        throw new Error("Trying to send an empty comment");
      }

      if (!postId) {
        throw new Error("Post is undefined");
      }

      const variable: CommentCreateArguments = {
        authorId: userId,
        postId,
        ...(parentId && { parentId }),
        text: JSON.stringify(content),
      };

      const { data, errors } = await createComment({
        variables: {
          input: variable,
        },
      });

      if (!data?.createComment || errors) {
        throw new Error("Error creating comment");
      }

      if (!errors) {
        setContent("");
        editor?.commands.setContent(``);

        if (postId && subscribeToMoreComments) {
          subscribeToMoreComments(postId);
        }

        setAnswerShowActive && setAnswerShowActive(true);

        toast.success("Comment was created!");
      }
    } catch (error: any) {
      console.error("onCreateComment error", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (postId && subscribeToMoreComments) {
      subscribeToMoreComments(postId);
    }
  }, [postId, subscribeToMoreComments]);

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
          editor.isEmpty !== true && onCreateComment();
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

export default CommentInput;
