import { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
  const [commentData, setCommentData] = useState<CommentPopulated>(item);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>(JSON.parse(item.text));

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

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

      if (!item.post.id) {
        throw new Error("Not provided with post id");
      }

      const { data, errors } = await editComment({
        variables: {
          id: item.post.id,
          text: JSON.stringify(content), // Convert content to JSON and send it for editing
        },
      });

      if (!data?.editComment || errors) {
        throw new Error("Error onEditComment when trying to edit");
      }

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
