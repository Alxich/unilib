import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { formatTimeToPost } from "../../util/functions";
import classNames from "classnames";

import { useMutation } from "@apollo/client";
import {
  TagArguments,
  TagItemProps,
  UpdateTagArguments,
} from "../../util/types";
import TagOperations from "../../graphql/operations/tags";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { Button } from "../elements";

const TagItem: FC<TagItemProps> = ({ item, session }: TagItemProps) => {
  const [tagFormData, setTagFormData] = useState<string | undefined>();
  const [tagData, setTagData] = useState<TagArguments>(item);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  // Define a mutation to update a existing tag

  const [updateTag] = useMutation<
    { updateTag: TagArguments },
    UpdateTagArguments
  >(TagOperations.Mutations.updateTag);

  const onUpdateTag = async (id: string, text: string) => {
    // Check if the user is not authorized
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");
      return false; // Return false to indicate the creation was not successful
    }

    try {
      const { username } = session.user;

      // Check if user exist to make tag creation secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const tag = {
        id,
        title: text,
      };

      // Use the updateTag mutation to create the new tag
      const { data, errors } = await updateTag({
        variables: {
          ...tag,
        },
      });

      // Check for errors during tag creation
      if (!data?.updateTag || errors) {
        throw new Error("Error updating tag");
      }

      // Display success message
      if (!errors) {
        toast.success("Tag was updated!");

        // Update the availableTagsArray with the newly created tag

        setTagFormData("");
        setTagData(data.updateTag);
        setFormVisible(false);

        // Return the newly created tag
        return data.updateTag;
      }
    } catch (error: any) {
      console.error("onUpdateTag error", error);
      toast.error(error?.message);
    }
  };
  return (
    <div className="table-row">
      <div className="information">
        <div className="table-data">{tagData.title}</div>
        <div className="table-data">{tagData.id}</div>
        <div className="table-data">{formatTimeToPost(tagData.createdAt)}</div>
        <div className="table-data">{formatTimeToPost(tagData.updatedAt)}</div>
        <div className="table-data">
          {tagData?.posts ? tagData.posts.length : 0}
        </div>
        <div
          className="table-data edit"
          onClick={() => setFormVisible(formVisible ? false : true)}
        >
          {formVisible ? "Close X" : "Edit"}
        </div>
      </div>
      <div
        className={classNames("update-current-item", {
          active: formVisible,
        })}
      >
        <form className="table-data">
          <input
            type="text"
            placeholder="Please fill the form with name of tag"
            value={tagFormData ? tagFormData : tagData.title}
            onChange={(e) => setTagFormData(e.target.value)}
          />
        </form>
        <div className="table-data">
          <Button
            filled
            disabled={!tagFormData}
            onClick={() => {
              tagFormData && onUpdateTag(item.id, tagFormData);
            }}
          >
            Update tag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagItem;
