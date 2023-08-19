import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatTimeToPost } from "../../util/functions";
import classNames from "classnames";

import { Session } from "next-auth";
import { useMutation } from "@apollo/client";
import {
  CommentAdminItemProps,
  CommentEditInteractionArguments,
} from "../../util/types";
import { CommentPopulated } from "../../../../backend/src/util/types";
import CommentOperations from "../../graphql/operations/comments";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { Button } from "../elements";
import { PostEdit } from "../elements/editor";
import ReturnMeContent from "../../util/functions/returnMeContent";

const CommentItem: FC<CommentAdminItemProps> = ({
  item,
  session,
}: CommentAdminItemProps) => {
  // State for storing comment data with initial values taken from the 'item' object
  const [commentData, setCommentData] = useState<CommentPopulated>(item);

  // State for controlling the visibility of the form
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // State for storing the content of the comment, initialized with the parsed 'text' from the 'item'
  const [content, setContent] = useState<string>(JSON.parse(item.text));

  // Close the form using the escape button
  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  // Function for updating the 'content' state
  const handleSetContent = (content: string) => {
    setContent(content);
  };

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

      if (!item.id) {
        throw new Error("Not provided with id");
      }

      // Edit the comment's content using the 'editComment' mutation
      const { data, errors } = await editComment({
        variables: {
          id: item.id,
          text: JSON.stringify(content), // Convert content to JSON and send it for editing
        },
      });

      // Check if the 'editComment' mutation was successful and handle errors
      if (!data?.editComment || errors) {
        throw new Error("Error onEditComment when trying to edit");
      }

      // If no errors occurred, display a success message
      if (!errors) {
        toast.success("Comment was edited!");
      }
    } catch (error: any) {
      console.error("onEditComment error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="table-row">
      <div className="information">
        <div className="table-data">{commentData.author.username}</div>
        <div className="table-data">{commentData.post.title}</div>
        <div className="table-data">
          {formatTimeToPost(commentData.updatedAt)}
        </div>
        <div className="table-data">{commentData.likes}</div>
        <div className="table-data">{commentData.dislikes}</div>

        {ReturnMeContent({
          content: commentData.text,
          className: "table-data",
        })}

        <div
          className="table-data edit"
          onClick={() => setFormVisible(formVisible ? false : true)}
        >
          {formVisible ? "Close X" : "Edit"}
        </div>
      </div>

      <div
        className={classNames("update-current-item big-form", {
          active: formVisible,
        })}
      >
        <form className="table-data has-content">
          <PostEdit content={content} setContent={handleSetContent} />
        </form>
        <div className="table-data">
          <Button
            filled
            disabled={!content}
            onClick={(e) => {
              e.preventDefault();
              onEditComment();
            }}
          >
            Update comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
