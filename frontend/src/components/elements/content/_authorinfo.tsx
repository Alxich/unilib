import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

import classNames from "classnames";
import { toast } from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";

import background from "../../../../public/images/background.png";

import { Session } from "next-auth";
import { useMutation, useQuery } from "@apollo/client";
import {
  CategoriesVariables,
  CategoryData,
  CategoryDataById,
  SearchUserData,
  SearchUserVariables,
  SubscribeCategoryArguments,
  TagData,
  TagDataById,
  TagsVariables,
} from "../../../util/types";

import CategoryOperations from "../../../graphql/operations/categories";
import TagOperations from "../../../graphql/operations/tags";
import UserOperations from "../../../graphql/operations/users";
import { CategoryPopulated } from "../../../../../backend/src/util/types";

interface AuthorInfoProps {
  type: "group" | "tag" | "author";
  id: string;
  session: Session | null;
  period: String;
  setPeriod: Dispatch<SetStateAction<string>>;
}

const AuthorInfo: FC<AuthorInfoProps> = ({
  type,
  session,
  id,
  period,
  setPeriod,
}: AuthorInfoProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [blockContent, setBlockContent] = useState<
    CategoryDataById | TagDataById
  >();

  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.subscribeToCategory);

  const [unsubscribeToCategory] = useMutation<
    { unsubscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.unsubscribeToCategory);

  const onSubscribeCategory = async (type: boolean) => {
    /**
     * When user smash the button we asign or remove from folowing the category
     */

    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username, id: userId } = session.user;

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      const subscribeData = {
        categoryId: id,
        userId,
      };

      if (type === true) {
        const { data, errors } = await subscribeToCategory({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.subscribeToCategory || errors) {
          throw new Error("Error subscribe category");
        }

        if (!errors) {
          toast.success("Category was subscribed!");
          setBlockContent(data.subscribeToCategory);
          setUserSubscribed(true);
        }
      } else {
        const { data, errors } = await unsubscribeToCategory({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.unsubscribeToCategory || errors) {
          throw new Error("Error unsubscribe category");
        }

        if (!errors) {
          toast.success("Category was unsubscribed!");
          setBlockContent(data.unsubscribeToCategory);
          setUserSubscribed(false);
        }
      }
    } catch (error: any) {
      console.log("onSubscribeCategory error", error);
      toast.error(error?.message);
    }
  };

  const { data: currentUser, loading: currentUserLoading } = useQuery<
    SearchUserData,
    SearchUserVariables
  >(UserOperations.Queries.searchUser, {
    variables: {
      id: session?.user.id || "",
    },
    skip: !session || type !== "group", // Skip the query when sessionUser is null or undefined and if the type is not "group"
    onError: (error) => {
      toast.error(`Error loading user: ${error}`);
      console.log("Error in queryCategory func", error);
    },
  });

  useEffect(() => {
    if (type !== "group") {
      // Skip the query if the type is not "group"
      if (currentUser && currentUserLoading != true) {
        const subscribedCategoryIDs =
          currentUser.searchUser.subscribedCategoryIDs;
        const isSubscribed = subscribedCategoryIDs.find(
          (categoryId) => categoryId === id
        );

        setUserSubscribed(isSubscribed ? true : false);
      }
    }
  }, [currentUserLoading, currentUser, id, session, type]);

  const { data: categoryData, loading: categoryLoading } = useQuery<
    CategoryData,
    CategoriesVariables
  >(CategoryOperations.Queries.queryCategory, {
    variables: {
      id: id,
    },
    skip: type !== "group", // Skip the query if the type is not "group"
    onError: (error) => {
      toast.error(`Error on loading category ${error}`);
      console.log("Error queryCategory func", error);
    },
  });

  const { data: tagData, loading: tagLoading } = useQuery<
    TagData,
    TagsVariables
  >(TagOperations.Queries.queryTag, {
    variables: {
      id: id,
    },
    skip: type !== "tag", // Skip the query if the type is not "group"
    onError: (error) => {
      toast.error(`Error on loading category ${error}`);
      console.log("Error queryCategory func", error);
    },
  });

  useEffect(() => {
    switch (type) {
      case "group":
        categoryLoading !== true &&
          categoryData &&
          setBlockContent(categoryData.queryCategory);
        break;
      case "tag":
        tagLoading !== true &&
          tagData &&
          setBlockContent(tagData.queryTag as TagDataById);
        break;
      case "author":
        categoryLoading !== true &&
          categoryData &&
          setBlockContent(categoryData.queryCategory);
        break;
      default:
        break;
    }
  }, [categoryData, categoryLoading, tagData, tagLoading, type]);

  const filterOptions = [
    { key: "popular", text: "По популярності" },
    { key: "today", text: "Cьогодні у ленті" },
    { key: "month", text: "Місяць" },
    { key: "year", text: "Рік" },
  ];

  return categoryLoading ? (
    <div>Loading</div>
  ) : (
    <div
      id="author-info"
      className={classNames("container", {
        tag: type === "tag",
      })}
    >
      {type !== "tag" && blockContent && "banner" in blockContent && (
        <div className="banner">
          <Image
            src={blockContent ? blockContent.banner : background}
            height={1080}
            width={1920}
            alt="author-background"
          />
        </div>
      )}
      <div className="info post-wrapper">
        {type !== "tag" && blockContent && "icon" in blockContent && (
          <div className="icon">
            <Image
              src={blockContent ? blockContent.icon : background}
              height={1080}
              width={1920}
              alt="author-icon"
            />
          </div>
        )}
        <div className="name">
          <h2>{blockContent ? blockContent.title : "Нова категорія"}</h2>
        </div>
        <div className="disription">
          <p>
            {type !== "tag" && blockContent && "icon" in blockContent
              ? blockContent.desc
              : type === "tag"
              ? "Ви зараз переглядаєте унікальний тег за яким ви можете знайти пост такої самої тематики. Вдачі вам у ваших пошуках :)"
              : "Тут могла бути ваша реклама"}
          </p>
        </div>
        {type !== "tag" &&
          blockContent &&
          "desc" in blockContent &&
          blockContent &&
          "subscriberCount" in blockContent && (
            <>
              <div className="author-counters">
                <div className="item">
                  <div className="count">
                    <p>{blockContent ? blockContent.subscriberCount : 0}</p>
                  </div>
                  <div className="title">
                    <p>стежувачів</p>
                  </div>
                </div>
                {blockContent === null && (
                  <div className="item">
                    <div className="count">
                      <p>110</p>
                    </div>
                    <div className="title">
                      <p>стежує</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        <div className="actions">
          <div className="list-of-actions">
            <div className="item active">
              <p>Записів</p>
            </div>
            {currentUser && (
              <div
                className="item"
                onClick={() => {
                  userSubscribed != true
                    ? onSubscribeCategory(true)
                    : onSubscribeCategory(false);
                }}
              >
                <p>{userSubscribed != true ? "Відстежувати" : "Відписатися"}</p>
              </div>
            )}
            {blockContent === null && (
              <>
                <div className="item">
                  <p>Коментарі</p>
                </div>
                <div className="item">
                  <p>Більше</p>
                </div>
              </>
            )}
          </div>
          <div className="changer filter open-more">
            <div className="fafont-icon interactive">
              <FontAwesomeIcon
                onClick={() => setOpenFilter(openFilter ? false : true)}
                icon={faAlignCenter}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div
              className={classNames("wrapper container flex-right width-auto", {
                active: openFilter,
              })}
            >
              <div className="triangle"></div>
              <div className="list container flex-left width-auto">
                {filterOptions.map(
                  (item: { key: string; text: string }, i: number) => (
                    <p
                      key={`${item}__${i}`}
                      className={classNames({ active: period === item.key })}
                      onClick={() => {
                        period !== item.key && setPeriod(item.key);
                      }}
                    >
                      {item.text}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
