import { Dispatch, FC, Key, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import { ObjectId } from "bson";
import { Session } from "next-auth";
import { useMutation, useQuery } from "@apollo/client";
import TagsOperations from "../../../graphql/operations/tags";
import {
  CreateTagArguments,
  TagArguments,
  TagsData,
} from "../../../util/types";

interface TagEditProps {
  session: Session | null;
  tags: TagArguments[] | undefined;
  setTags: Dispatch<SetStateAction<TagArguments[] | undefined>>;
}

export const TagEdit: FC<TagEditProps> = ({
  session,
  tags,
  setTags,
}: TagEditProps) => {
  const [newTag, setNewTag] = useState<string | undefined>("");
  const [availableTagsArray, setAvailableTagsArray] = useState<
    TagArguments[] | undefined
  >([]);

  // Define a mutation to create a new tag

  const [createTag] = useMutation<
    { createTag: TagArguments },
    CreateTagArguments
  >(TagsOperations.Mutations.createTag);

  // Query available tags from the server

  const {
    data: availableTags,
    loading,
    error,
  } = useQuery<TagsData>(TagsOperations.Queries.queryTags, {
    onCompleted(data) {
      // When the query completes, update the availableTagsArray with the queried data
      setAvailableTagsArray(data.queryTags);
    },
  });

  // Function to create a new tag

  const onCreateTag = async (newTag: string) => {
    // Check if the user is not authorized
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");
      return false; // Return false to indicate the creation was not successful
    }

    try {
      const { username } = session.user;
      const newId = new ObjectId().toString();

      // Check if user exist to make tag creation secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const tag = {
        id: newId,
        title: newTag,
      };

      // Use the createTag mutation to create the new tag
      const { data, errors } = await createTag({
        variables: {
          ...tag,
        },
      });

      // Check for errors during tag creation
      if (!data?.createTag || errors) {
        throw new Error("Error creating tag");
      }

      // Display success message
      if (!errors) {
        toast.success("Tag was created!");

        // Update the availableTagsArray with the newly created tag
        if (availableTagsArray) {
          setAvailableTagsArray([...availableTagsArray, data.createTag]);
        }

        // Return the newly created tag
        return data.createTag;
      }
    } catch (error: any) {
      console.error("onCreateTag error", error);
      toast.error(error?.message);
    }
  };

  // Function to handle adding a new tag

  const handleAddTag = async () => {
    // Check if newTag and availableTagsArray exist
    if (newTag && availableTagsArray) {
      // Use the map function on tags to check for duplicate tags
      const createdNewTag = tags?.map(async (item) => {
        // Check if the current tag's title includes the newTag
        if (item.title.includes(newTag)) {
          // Display an error message if a similar tag already exists
          console.error("Цей тег вже доданий!");
          toast.error(`Tag ${newTag} already added`);
        } else {
          // Use map on availableTagsArray to recheck for duplicates
          availableTagsArray.map((item: TagArguments) => {
            // Display an error message if a similar tag already exists
            if (item.title.includes(newTag)) {
              console.error("Цей тег вже доданий!");
              toast.error(`Tag ${newTag} already added`);
            }
          });

          // If no duplicates found, return true
          return true;
        }
      });

      // Check if any duplicates were found
      if (createdNewTag) {
        // Call onCreateTag to create the new tag
        const tagCreated = await onCreateTag(newTag);

        // If the tag is created and tags array exists
        if (tagCreated && tags) {
          // Add the newly created tag to the tags array
          setTags([...tags, tagCreated]);

          // Reset the newTag input field
          setNewTag("");
        }
      }
    }
  };

  // When user select tags from list we add them to used tags array

  const handleSelectTag = (selectedTag: TagArguments) => {
    if (tags) {
      if (!tags.includes(selectedTag)) {
        setTags([...tags, selectedTag]);
      }
    }
  };

  const handleTagChange = (e: any) => {
    setNewTag(e.target.value);
  };

  return loading ? (
    <div id="tag-editor">Loading</div>
  ) : (
    <div id="tag-editor">
      {tags && tags?.length > 0 && (
        <div className="tags">
          {tags?.map((tag, index) => (
            <span key={index} className="tag">
              #{tag.title},{" "}
            </span>
          ))}
        </div>
      )}
      <div className="add-tag">
        {" "}
        <input
          className="tagwritter"
          type="text"
          value={newTag}
          onChange={handleTagChange}
        />
        <button className="button filled" onClick={handleAddTag}>
          Додати тег
        </button>
      </div>
      {availableTagsArray ? (
        <div className="available-tags">
          <div className="title">
            <h5>Доступні теги:</h5>
          </div>
          {availableTagsArray?.map(
            (item: TagArguments, index: Key | null | undefined) => (
              <button
                className="button filled"
                key={index}
                onClick={() => handleSelectTag(item)}
              >
                {item.title}
              </button>
            )
          )}
        </div>
      ) : (
        <div className="tag-editor error">Немає доступних тегів</div>
      )}
    </div>
  );
};

export default TagEdit;
