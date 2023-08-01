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

  const [createTag] = useMutation<
    { createTag: TagArguments },
    CreateTagArguments
  >(TagsOperations.Mutations.createTag);

  const {
    data: availableTags,
    loading,
    error,
  } = useQuery<TagsData>(TagsOperations.Queries.queryTags, {
    onCompleted(data) {
      setAvailableTagsArray(data.queryTags);
    },
  });

  const onCreateTag = async (newTag: string) => {
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");

      return false;
    }

    try {
      const { username } = session.user;
      const newId = new ObjectId().toString();

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const tag = {
        id: newId,
        title: newTag,
      };

      const { data, errors } = await createTag({
        variables: {
          ...tag,
        },
      });

      if (!data?.createTag || errors) {
        throw new Error("Error creating tag");
      }

      if (!errors) {
        toast.success("Tag was created!");

        if (availableTagsArray) {
          setAvailableTagsArray([...availableTagsArray, data.createTag]);
        }

        return data.createTag;
      }
    } catch (error: any) {
      console.error("onCreateTag error", error);
      toast.error(error?.message);
    }
  };

  const handleAddTag = async () => {
    if (newTag && availableTagsArray) {
      const createdNewTag = tags?.map(async (item) => {
        if (item.title.includes(newTag)) {
          console.error("Цей тег вже доданий!");
          toast.error(`Tag ${newTag} already added`);
        } else {
          availableTagsArray.map((item: TagArguments) => {
            if (item.title.includes(newTag)) {
              console.error("Цей тег вже доданий!");
              toast.error(`Tag ${newTag} already added`);
            }
          });

          return true;
        }
      });

      if (createdNewTag) {
        const tagCreated = await onCreateTag(newTag);

        if (tagCreated && tags) {
          setTags([...tags, tagCreated]);
          setNewTag("");
        }
      }
    }
  };

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
