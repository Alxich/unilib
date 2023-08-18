import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

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
  // Initialize the editor with specified extensions and configurations
  const editor = useEditor({
    content: content, // Initial content of the editor
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Написати свій коментар ...", // Placeholder text
        showOnlyCurrent: true, // Show the placeholder only in the current state
      }),
    ],
    injectCSS: false,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      setContent(editor.getJSON()); // Update content with the editor's JSON data
    },
  });

  // State variables for controlling image pop-up and its text
  const [openImagePop, setOpenImagePop] = useState(false);
  const [imagePopText, setImagePopText] = useState("");

  // Mutation for editing a comment
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

  // Function to edit a comment's content
  const onEditComment = async () => {
    /**
     * This func allow author to edit a comment
     * It will not edit at all but change the content
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

      // Check if the author's ID matches the user's ID
      if (authorId !== session?.user.id) {
        throw new Error("You are not the author!");
      }

      const { data, errors } = await editComment({
        variables: {
          id: id,
          text: JSON.stringify(content), // Convert content to JSON and send it for editing
        },
      });

      if (!data?.editComment || errors) {
        throw new Error("Error onEditComment when trying to edit");
      }

      if (!errors) {
        toast.success("Comment was edited!");
        setEditActive(false); // Deactivate the edit mode
      }
    } catch (error: any) {
      console.error("onEditComment error", error);
      toast.error(error?.message);
    }
  };

  // Use the useEscapeClose hook to handle escape key press and close the element
  useEscapeClose({
    activeElem: true, // Always true, no need to check the state
    setActiveElem: setEditActive, // Set the active element state
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
