import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";

import { useMutation } from "@apollo/client";
import { Session } from "next-auth";

import CommentOperations from "../../../../graphql/operations/comments";
import { CommentEditInteractionArguments } from "../../../../util/types";
import { CommentPopulated } from "../../../../../../backend/src/util/types";
import { useEscapeClose } from "../../../../util/functions/useEscapeClose";

import CommentForm from "./_commentform";

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

  /**
   * Using useEscapeClose function to close the element
   */
  useEscapeClose({
    activeElem: true, // Always true no need to check the state
    setActiveElem: setEditActive,
  });

  if (!editor) {
    return null;
  }

  return (
    <CommentForm
      editor={editor}
      createFunction={onEditComment}
      setOpenImagePop={setOpenImagePop}
      openImagePop={openImagePop}
      imagePopText={imagePopText}
      setImagePopText={setImagePopText}
    />
  );
};

export default CommentInputEdit;
