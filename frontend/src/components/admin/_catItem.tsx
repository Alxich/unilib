import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatTimeToPost } from "../../util/functions";
import classNames from "classnames";

import { Session } from "next-auth";
import { useMutation } from "@apollo/client";
import {
  CatFormInput,
  CategoryArguments,
  UpdateCategoryArguments,
} from "../../util/types";
import CategoryOperations from "../../graphql/operations/categories";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { Button } from "../elements";

interface CategoryItemProps {
  session: Session;
  item: CategoryArguments;
}

const CategoryItem: FC<CategoryItemProps> = ({
  item,
  session,
}: CategoryItemProps) => {
  const [categoryFormData, setCategoryFormData] = useState<CatFormInput>({
    id: item.id,
  });
  const [categoryData, setCategoryData] = useState<CategoryArguments>(item);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  // Define a mutation to update a existing category

  const [updateCategory] = useMutation<
    { updateCategory: CategoryArguments },
    UpdateCategoryArguments
  >(CategoryOperations.Mutations.updateCategory);

  const onUpdateCategory = async ({
    id,
    title,
    desc,
    banner,
    icon,
  }: CatFormInput) => {
    // Check if the user is not authorized
    if (session == null) {
      console.error("onCreateCategory error: Not Authorized Session");
      return false; // Return false to indicate the creation was not successful
    }

    try {
      const { username } = session.user;

      // Check if user exist to make category creation secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const category: CatFormInput = {
        id,
        title,
        banner,
        desc,
        icon,
      };

      // Use the updateCategory mutation to create the new category
      const { data, errors } = await updateCategory({
        variables: {
          ...category,
        },
      });

      // Check for errors during category creation
      if (!data?.updateCategory || errors) {
        throw new Error("Error updating category");
      }

      // Display success message
      if (!errors) {
        toast.success("Category was updated!");

        // Update the availableCategorysArray with the newly created category

        setCategoryFormData({ id: data.updateCategory.id });
        setCategoryData(data.updateCategory);
        setFormVisible(false);

        // Return the newly created category
        return data.updateCategory;
      }
    } catch (error: any) {
      console.error("onUpdateCategory error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="table-row">
      <div className="information">
        <div className="table-data">{categoryData.title}</div>
        <div className="table-data">{categoryData.id}</div>
        <div className="table-data">
          {formatTimeToPost(categoryData.createdAt)}
        </div>
        <div className="table-data">
          {formatTimeToPost(categoryData.updatedAt)}
        </div>
        <div className="table-data">
          {categoryData?.posts ? categoryData.posts.length : 0}
        </div>
        <div
          className="table-data edit"
          onClick={() => setFormVisible(formVisible ? false : true)}
        >
          Edit
        </div>
      </div>
      <div
        className={classNames("update-current-item big-form", {
          active: formVisible,
        })}
      >
        <form className="table-data">
          <input
            type="text"
            placeholder="Please fill the form with title of category"
            value={
              categoryFormData?.title
                ? categoryFormData.title
                : categoryData.title
            }
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                title: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Please fill the form with icon of category"
            value={
              categoryFormData?.icon ? categoryFormData.icon : categoryData.icon
            }
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                icon: e.target.value,
              })
            }
          />
          <textarea
            placeholder="Please fill the form with desc of category"
            value={
              categoryFormData?.desc ? categoryFormData.desc : categoryData.desc
            }
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                desc: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Please fill the form with banner of category"
            value={
              categoryFormData?.banner
                ? categoryFormData.banner
                : categoryData.banner
            }
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                banner: e.target.value,
              })
            }
          />
        </form>
        <div className="table-data">
          <Button
            filled
            disabled={!categoryFormData}
            onClick={() => {
              categoryFormData &&
                onUpdateCategory({
                  ...categoryFormData,
                });
            }}
          >
            Update category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;
