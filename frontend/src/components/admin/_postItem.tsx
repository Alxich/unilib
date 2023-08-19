import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatTimeToPost } from "../../util/functions";
import classNames from "classnames";

import { Session } from "next-auth";
import { useMutation } from "@apollo/client";
import {
  PostItemProps,
  TagArguments,
  UpdatePostArguments,
} from "../../util/types";
import { PostPopulated } from "../../../../backend/src/util/types";
import PostOperations from "../../graphql/operations/posts";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { Button } from "../elements";
import { PostEdit, TagEdit } from "../elements/editor";

const PostItem: FC<PostItemProps> = ({ item, session }: PostItemProps) => {
  // Initialize state variables for form data and UI state
  const [postFormData, setPostFormData] = useState<UpdatePostArguments>({
    id: item.id,
    content: item.content,
    title: item.title,
    tagsId: item.tags,
  });
  const [postData, setPostData] = useState<PostPopulated>(item);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Initialize state variables for tags and content
  const [tags, setTags] = useState<TagArguments[] | undefined>(item.tags);
  const [content, setContent] = useState<string>(JSON.parse(item.content));

  // Function to update content state and postFormData when content changes
  const handleSetContent = (content: string) => {
    setContent(content);

    // Update postFormData with new content
    setPostFormData({
      ...postFormData,
      content: JSON.stringify(content),
    });
  };

  // Function to update tags state and postFormData when tags change
  const handleSetTags = (tagsUpdated: TagArguments[]) => {
    setTags(tagsUpdated);

    // Update postFormData with new tags
    setPostFormData({
      ...postFormData,
      tagsId: tagsUpdated,
    });
  };

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  // Define a mutation to update a existing post

  const [updatePost] = useMutation<
    { updatePost: PostPopulated },
    UpdatePostArguments
  >(PostOperations.Mutations.updatePost);

  const onUpdatePost = async (post: UpdatePostArguments) => {
    // Check if the user is not authorized
    if (session == null) {
      console.error("onCreatePost error: Not Authorized Session");
      return false; // Return false to indicate the creation was not successful
    }

    try {
      const { username } = session.user;

      // Check if user exist to make post creation secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Use the updatePost mutation to create the new post
      const { data, errors } = await updatePost({
        variables: {
          ...post,
        },
      });

      // Check for errors during post creation
      if (!data?.updatePost || errors) {
        throw new Error("Error updating post");
      }

      // Display success message
      if (!errors) {
        toast.success("Post was updated!");

        // Update the availablePostsArray with the newly created post

        setPostFormData({
          id: "",
          content: "",
          title: "",
          tagsId: [],
        });
        handleSetContent("");
        setPostData(data.updatePost);
        setFormVisible(false);

        // Return the newly created post
        return data.updatePost;
      }
    } catch (error: any) {
      console.error("onUpdatePost error", error);
      toast.error(error?.message);
    }
  };
  return (
    <div className="table-row">
      <div className="information">
        <div className="table-data">{postData.title}</div>
        <div className="table-data">{postData.author.username}</div>
        <div className="table-data">{postData.likes}</div>
        <div className="table-data">{postData.dislikes}</div>
        <div className="table-data">{postData.views}</div>
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
          <div className="column__item">
            <input
              type="text"
              placeholder="Please fill the form with title of post"
              value={postFormData?.title ? postFormData.title : postData.title}
              onChange={(e) =>
                setPostFormData({
                  ...postFormData,
                  title: e.target.value,
                })
              }
            />
            <TagEdit session={session} setTags={handleSetTags} tags={tags} />
          </div>
          <PostEdit content={content} setContent={handleSetContent} />
        </form>
        <div className="table-data">
          <Button
            filled
            disabled={!postFormData}
            onClick={() => {
              postFormData &&
                onUpdatePost({
                  ...postFormData,
                });
            }}
          >
            Update post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
