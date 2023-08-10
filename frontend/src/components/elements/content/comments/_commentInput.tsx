import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";

import { useMutation } from "@apollo/client";
import { Session } from "next-auth";

import CommentOperations from "../../../../graphql/operations/comments";
import {
  CommentCreateArguments,
  CommentCreateVariables,
} from "../../../../util/types";
import CommentForm from "./_commentform";

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

  // Mutation for creating a new comment
  const [createComment] = useMutation<
    { createComment: CommentCreateArguments },
    CommentCreateVariables
  >(CommentOperations.Mutations.createComment);

  // Function to create a new comment
  const onCreateComment = async () => {
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }
      const { username, id: userId } = session.user;

      // Check if user exists to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if the editor content is not empty
      if (editor === null || editor.isEmpty) {
        throw new Error("Trying to send an empty comment");
      }

      // Check if postId is defined
      if (!postId) {
        throw new Error("Post is undefined");
      }

      // Create the comment data
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

        // Subscribe to more comments if postId and subscribeToMoreComments function are available
        if (postId && subscribeToMoreComments) {
          subscribeToMoreComments(postId);
        }

        // Set the answerShowActive state if available
        setAnswerShowActive && setAnswerShowActive(true);

        toast.success("Comment was created!");
      }
    } catch (error: any) {
      console.error("onCreateComment error", error);
      toast.error(error?.message);
    }
  };

  // Subscribe to more comments when postId and subscribeToMoreComments function are available
  useEffect(() => {
    if (postId && subscribeToMoreComments) {
      subscribeToMoreComments(postId);
    }
  }, [postId, subscribeToMoreComments]);

  if (!editor) {
    return null;
  }

  return (
    <CommentForm
      editor={editor}
      createFunction={onCreateComment}
      setOpenImagePop={setOpenImagePop}
      openImagePop={openImagePop}
      imagePopText={imagePopText}
      setImagePopText={setImagePopText}
    />
  );
};

export default CommentInput;
