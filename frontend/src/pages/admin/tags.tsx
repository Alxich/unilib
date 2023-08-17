import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { ObjectId } from "bson";
import classNames from "classnames";

import { useSession } from "next-auth/react";

import { useMutation, useQuery } from "@apollo/client";
import TagOperations from "../../graphql/operations/tags";
import {
  CreateTagArguments,
  TagArguments,
  TagsData,
  TagsVariables,
} from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { TagItem } from "../../components/admin";
import { Button } from "../../components/elements";

const AdminPageTags: FC<NextPage> = () => {
  const { data: session } = useSession();
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  const LoadingCompanents = (
    <>
      <div className="table-row">
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
      </div>
    </>
  );

  const [tags, setTags] = useState<TagArguments[] | undefined>();
  const [newTag, setNewTag] = useState<string | undefined>();

  const { data, loading, fetchMore } = useQuery<TagsData, TagsVariables>(
    TagOperations.Queries.queryTags,
    {
      onCompleted(data) {
        setTags(data.queryTags);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  // Define a mutation to create a new tag

  const [createTag] = useMutation<
    { createTag: TagArguments },
    CreateTagArguments
  >(TagOperations.Mutations.createTag);

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
        if (tags) {
          setNewTag("");
          setTags([data.createTag, ...tags]);
        }

        // Return the newly created tag
        return data.createTag;
      }
    } catch (error: any) {
      console.error("onCreateTag error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all tags which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
                Do you want to create a new tag ?
              </p>
            </div>
            <div className="header__item">
              <Button
                filled
                onClick={() => {
                  setFormVisible(formVisible ? false : true);
                }}
              >
                {formVisible ? "Close the form" : "Create new tag"}
              </Button>
            </div>
          </div>
          <div
            className={classNames("table-header create create__form", {
              active: formVisible,
            })}
          >
            <form className="header__item">
              <input
                type="text"
                placeholder="Please fill the form with name of tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </form>
            <div className="header__item">
              <Button
                filled
                disabled={!newTag}
                onClick={() => {
                  newTag && onCreateTag(newTag);
                }}
              >
                Add tag
              </Button>
            </div>
          </div>
          <div className="table-header">
            <div className="header__item">
              <p id="title" className="filter__link">
                Title
              </p>
            </div>
            <div className="header__item">
              <p id="author" className="filter__link filter__link--number">
                id
              </p>
            </div>
            <div className="header__item">
              <p id="likes" className="filter__link filter__link--number">
                Created At
              </p>
            </div>
            <div className="header__item">
              <p id="dislikes" className="filter__link filter__link--number">
                Updated At
              </p>
            </div>
            <div className="header__item">
              <p id="views" className="filter__link filter__link--number">
                Posts count
              </p>
            </div>
            <div className="header__item">
              <p id="edit" className="filter__link filter__link--number">
                Edit
              </p>
            </div>
          </div>
          <div className="table-content">
            {loading
              ? LoadingCompanents
              : !session
              ? toast.error("No session")
              : tags && (
                  <InfiniteScroll
                    dataLength={tags.length}
                    next={() => {}}
                    hasMore={false}
                    loader={LoadingCompanents}
                    key={tags.map((item) => item.id).join("-")} // Unique key for tags array
                  >
                    {tags.map((item: TagArguments, i: number) => {
                      return (
                        <TagItem
                          session={session}
                          item={item}
                          key={`${item}__${i}`}
                        />
                      );
                    })}
                  </InfiniteScroll>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageTags;
