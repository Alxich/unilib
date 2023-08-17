import { FC, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { ObjectId } from "bson";

import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client";
import CategoryOperations from "../../graphql/operations/categories";
import { CategoryPopulated } from "../../../../backend/src/util/types";
import {
  CategoriesData,
  CategoriesVariables,
  CategoryArguments,
  CreateCategoryArguments,
  CreateCategoryData,
  onCreateCategoryArgs,
} from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button } from "../../components/elements";
import { CategoryItem } from "../../components/admin";

import { useEscapeClose } from "../../util/functions/useEscapeClose";
import classNames from "classnames";

const AdminPageCategories: FC<NextPage> = () => {
  const { data: session } = useSession();
  const [categoryFormData, setCategoryFormData] = useState<
    onCreateCategoryArgs | undefined
  >();
  const [categories, setCategories] = useState<
    CategoryPopulated[] | undefined
  >();

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

  const { data, loading, fetchMore } = useQuery<
    CategoriesData,
    CategoriesVariables
  >(CategoryOperations.Queries.queryCategories, {
    onCompleted(data) {
      setCategories(data.queryCategories);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  // Define a mutation to create a new tag

  const [createCategory] = useMutation<
    CreateCategoryData,
    CreateCategoryArguments
  >(CategoryOperations.Mutations.createCategory);

  // Function to create a new tag

  const onCreateCategory = async (newCategory: onCreateCategoryArgs) => {
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

      const { title, desc, icon, banner } =
        categoryFormData as onCreateCategoryArgs;

      if (!title || !desc || !icon || !banner) {
        throw new Error("Not inserted enough of data by user");
      }

      if (newCategory) {
        // Use the createCategory mutation to create the new tag
        const { data, errors } = await createCategory({
          variables: {
            id: newId,
            ...newCategory,
          },
        });

        // Check for errors during tag creation
        if (!data?.createCategory || errors) {
          throw new Error("Error creating tag");
        }

        console.log(data);

        // Display success message
        if (!errors) {
          toast.success("Category was created!");

          // Update the availableCategorysArray with the newly created category

          setCategoryFormData(undefined);
          setCategories(
            categories
              ? [data.createCategory, ...categories]
              : [data.createCategory]
          );
          setFormVisible(false);

          // Return the newly created tag
          return data.createCategory;
        }
      } else {
        throw new Error("Error creating tag: Not enough provided data");
      }
    } catch (error: any) {
      console.error("onCreateCategory error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all categories which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
                Do you want to create a new category ?
              </p>
            </div>
            <div className="header__item">
              <Button
                filled
                className="filter__link"
                onClick={() => setFormVisible(formVisible ? false : true)}
              >
                {formVisible ? "Close the form" : "Create new category"}
              </Button>
            </div>
          </div>
          <div
            className={classNames("table-header create create__form big-form", {
              active: formVisible,
            })}
          >
            <form className="header__item">
              <input
                type="text"
                placeholder="Please fill the form with title of category"
                value={categoryFormData?.title ? categoryFormData.title : ""}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    title: e.target.value,
                  } as onCreateCategoryArgs)
                }
              />
              <input
                type="text"
                placeholder="Please fill the form with icon of category"
                value={categoryFormData?.icon ? categoryFormData.icon : ""}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    icon: e.target.value,
                  } as onCreateCategoryArgs)
                }
              />
              <textarea
                placeholder="Please fill the form with desc of category"
                value={categoryFormData?.desc ? categoryFormData.desc : ""}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    desc: e.target.value,
                  } as onCreateCategoryArgs)
                }
              />
              <input
                type="text"
                placeholder="Please fill the form with banner of category"
                value={categoryFormData?.banner ? categoryFormData.banner : ""}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    banner: e.target.value,
                  } as onCreateCategoryArgs)
                }
              />
            </form>
            <div className="header__item">
              <Button
                filled
                disabled={!categoryFormData}
                onClick={() => {
                  categoryFormData && onCreateCategory(categoryFormData);
                }}
              >
                Add Category
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
              ? toast.error("No user authorized")
              : categories && (
                  <InfiniteScroll
                    dataLength={categories.length}
                    next={() => {}}
                    hasMore={false}
                    loader={LoadingCompanents}
                    key={categories.map((item) => item.id).join("-")} // Unique key for categories array
                  >
                    {categories.map((item: CategoryArguments, i: number) => {
                      return (
                        <CategoryItem
                          item={item}
                          session={session}
                          key={`${item}___${i}`}
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

export default AdminPageCategories;
