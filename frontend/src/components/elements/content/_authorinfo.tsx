import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";
import { useMutation, useQuery } from "@apollo/client";

import {
  AuthorInfoTypes,
  CategoriesVariables,
  CategoryData,
  DeleteItemResoponse,
  FollowUserArguments,
  SearchUserData,
  SearchUserVariables,
  SubscribeCategoryArguments,
  TagData,
  TagsVariables,
} from "../../../util/types";

import CategoryOperations from "../../../graphql/operations/categories";
import TagOperations from "../../../graphql/operations/tags";
import UserOperations from "../../../graphql/operations/users";
import { CategoryPopulated } from "../../../../../backend/src/util/types";
import { formatTimeToPost } from "../../../util/functions";

import { AuthorinfoEdit, AuthorinfoWrite } from "./authorinfo";

import background from "../../../../public/images/background.png";
import { AuthorInfoLoading } from "../../skeletons";

interface AuthorInfoProps {
  type: "group" | "tag" | "author";
  auhtorEdit?: boolean;
  id: string;
  session: Session | null;
  period: string;
  setPeriod: Dispatch<SetStateAction<string>>;
  showMore?: boolean;
  setShowMore?: Dispatch<SetStateAction<boolean>>;
  showComments?: boolean;
  setShowComments?: Dispatch<SetStateAction<boolean>>;
}

const AuthorInfo: FC<AuthorInfoProps> = ({
  type,
  session,
  id,
  period,
  setPeriod,
  showMore,
  setShowMore,
  showComments,
  setShowComments,
  auhtorEdit,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [blockContent, setBlockContent] = useState<AuthorInfoTypes>();

  // Mutation to subscribe to a category
  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.subscribeToCategory);

  // Mutation to unsubscribe from a category
  const [unsubscribeToCategory] = useMutation<
    { unsubscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.unsubscribeToCategory);

  // Function to handle category subscription/unsubscription
  const onSubscribeCategory = async (type: boolean) => {
    /**
     * When user clicks the button, we assign or
     * remove them from following the category.
     */

    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username, id: userId } = session.user;

      // Check if user exists to ensure post security
      if (!username) {
        throw new Error("Not authorized user");
      }

      const subscribeData = {
        categoryId: id,
        userId,
      };

      // If type is true, the user wants to subscribe to the category
      if (type === true) {
        const { data, errors } = await subscribeToCategory({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.subscribeToCategory || errors) {
          throw new Error("Error subscribing to category");
        }

        if (!errors) {
          toast.success("Category was subscribed!");

          // Update the UI state to reflect the subscription
          setBlockContent(data.subscribeToCategory);
          setUserSubscribed(true);
        }
      } else {
        // If type is false, the user wants to unsubscribe from the category
        const { data, errors } = await unsubscribeToCategory({
          variables: {
            ...subscribeData,
          },
        });

        /**
         * If we receive an empty data we show it like an error
         * It is because we can`t use undefined data to our opperations
         */

        if (!data?.unsubscribeToCategory || errors) {
          throw new Error("Error unsubscribing from category");
        }

        if (!errors) {
          toast.success("Category was unsubscribed!");

          // Update the UI state to reflect the unsubscription
          setBlockContent(data.unsubscribeToCategory);
          setUserSubscribed(false);
        }
      }
    } catch (error: any) {
      console.error("onSubscribeCategory error", error);
      toast.error(error?.message);
    }
  };

  // Query to fetch current user data
  const {
    data: currentUser,
    loading: currentUserLoading,
    refetch: refetchUser,
  } = useQuery<SearchUserData, SearchUserVariables>(
    UserOperations.Queries.searchUser,
    {
      variables: {
        // If the type is "author", use the provided id, otherwise use session user id
        id: type === "author" ? id : session?.user.id || "",
      },
      /**
       * Skip the query when sessionUser is null
       * or undefined and if the type is not "group".
       * -----------------------------------------------
       * If it is a user we ignore it and load all staff
       * because session not important in that case.
       */
      skip: type !== "author", // Skip the query if the type is not "group"
      onCompleted(data) {
        // Update the block content with the fetched user data
        setBlockContent({ ...data.searchUser });
      },
      onError: (error) => {
        // Display an error toast message and log the error
        toast.error(`Error loading user: ${error}`);
        console.error("Error in searchUser func", error);
      },
    }
  );

  // Query to fetch category data
  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: refetchCategory,
  } = useQuery<CategoryData, CategoriesVariables>(
    CategoryOperations.Queries.queryCategory,
    {
      variables: {
        id: id, // The category ID to fetch
      },
      // Skip the query when the type is not "group"
      skip: type !== "group",
      onCompleted(data) {
        // Update the block content with the fetched category data
        setBlockContent({ ...data.queryCategory });
      },
      onError: (error) => {
        // Display an error toast message and log the error
        toast.error(`Error on loading category ${error}`);
        console.error("Error queryCategory func", error);
      },
    }
  );

  // Query to fetch tag data
  const {
    data: tagData,
    loading: tagLoading,
    refetch: refetchTag,
  } = useQuery<TagData, TagsVariables>(TagOperations.Queries.queryTag, {
    variables: {
      id: id, // The tag ID to fetch
    },
    // Skip the query when the type is not "tag"
    skip: type !== "tag",
    onCompleted(data) {
      // Update the block content with the fetched tag data
      setBlockContent({ ...data.queryTag });
    },
    onError: (error) => {
      // Display an error toast message and log the error
      toast.error(`Error on loading tag ${error}`);
      console.error("Error queryTag func", error);
    },
  });

  // useEffect to manage data refetching based on the type parameter
  useEffect(() => {
    switch (type) {
      // If type is "author", trigger a refetch of user data
      case "author": {
        refetchUser();
        break;
      }
      // If type is "group", trigger a refetch of category data
      case "group": {
        refetchCategory();
        break;
      }
      // If type is "tag", trigger a refetch of tag data
      case "tag": {
        refetchTag();
        break;
      }
      // Default case: do nothing
      default: {
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mutation hook for following a user
  const [followUser] = useMutation<
    { followUser: FollowUserArguments },
    FollowUserArguments
  >(UserOperations.Mutations.followUser);

  // Mutation hook for unfollowing a user
  const [unfollowUser] = useMutation<
    { unfollowUser: DeleteItemResoponse },
    FollowUserArguments
  >(UserOperations.Mutations.unfollowUser);

  // Function to handle following or unfollowing a user
  const onFollowUser = async (type: boolean) => {
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username, id: userId } = session.user;

      // Check if user exist to make post secure
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if user exist to make post secure
      if (!currentUser) {
        throw new Error("Not authorized user");
      }

      const subscribeData: FollowUserArguments = {
        followerId: userId,
        followingId: currentUser.searchUser.id,
      };

      // If the follow type is true, indicating the user wants to follow the user
      if (type === true) {
        // Execute the followUser mutation
        const { data, errors } = await followUser({
          variables: {
            ...subscribeData,
          },
        });

        // Check if there are errors or if data.followUser is falsy
        if (!data?.followUser || errors) {
          // If there are errors or followUser response is falsy, throw an error
          throw new Error("Error following user");
        }

        // If there are no errors, display a success toast message and update the user's subscription status
        if (!errors) {
          toast.success("User was followed!");
          setUserSubscribed(true);
        }
      } else {
        // If the follow type is false, indicating the user wants to unfollow the user
        // Execute the unfollowUser mutation
        const { data, errors } = await unfollowUser({
          variables: {
            ...subscribeData,
          },
        });

        // Check if there are errors or if data.unfollowUser.success is falsy
        if (!data?.unfollowUser.success || errors) {
          // If there are errors or unfollowUser response is falsy, throw an error
          throw new Error("Error unfollowing user");
        }

        // If there are no errors, display a success toast message and update the user's subscription status
        if (!errors) {
          toast.success("User was unfollowed!");
          setUserSubscribed(false);
        }
      }
    } catch (error: any) {
      // Catch all errors that can appear while operating
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  // useEffect to handle user subscription status based on the block content type
  useEffect(() => {
    // If the type is not "author" and not "tag"
    if (type !== "author" && type !== "tag") {
      // Check if category data is available and loading is not true
      if (categoryData && categoryLoading !== true) {
        // If there is an active session
        if (session) {
          // Get the list of subscribed users from the category data
          const subscribedUsers = categoryData.queryCategory.subscribers;
          const { id } = session.user;

          // Check if the current user is subscribed
          if (session && categoryData.queryCategory) {
            const isSubscribed = subscribedUsers.find(
              (follow) => follow.id === id
            );
            setUserSubscribed(isSubscribed ? true : false);
          } else {
            // If the category data is not available or session is not authorized, set user as subscribed
            setUserSubscribed(true);
          }
        }
      } else {
        // If category data is not available or session is not authorized, set user as unsubscribed
        console.error("Not authorized Session");
        setUserSubscribed(false);
      }
    } else if (type === "author") {
      // If the type is "author"
      if (currentUser?.searchUser && currentUserLoading !== true) {
        // Check if there is an active session
        if (session) {
          // Get the list of users followed by the current user
          const subscribedUsers = currentUser.searchUser.followedBy;
          const { id } = session.user;

          if (subscribedUsers) {
            // Check if the current user is following the author
            const isSubscribed = subscribedUsers.find(
              (follow) => follow.follower.id === id
            );
            setUserSubscribed(isSubscribed ? true : false);
          } else {
            // If the subscribed users list is not available, set user as subscribed
            setUserSubscribed(true);
          }
        } else {
          // If there is no active session, set user as unsubscribed
          console.error("Not authorized Session");
          setUserSubscribed(false);
        }
      }
    }
  }, [
    categoryData,
    categoryLoading,
    currentUser,
    currentUserLoading,
    id,
    session,
    type,
  ]);

  const filterOptions = [
    { key: "popular", text: "По популярності" },
    { key: "today", text: "Cьогодні у ленті" },
    { key: "month", text: "Місяць" },
    { key: "year", text: "Рік" },
  ];

  return categoryLoading || currentUserLoading || tagLoading ? (
    <AuthorInfoLoading type={type} />
  ) : (
    <div
      id="author-info"
      className={classNames("container", {
        tag: type === "tag",
      })}
    >
      {type !== "tag" && blockContent && (
        <div className="banner">
          <Image
            src={blockContent?.banner ? blockContent.banner : background}
            height={1080}
            width={1920}
            alt="author-background"
          />
        </div>
      )}
      <div className="info post-wrapper">
        {type !== "tag" && blockContent && (
          <div className="icon">
            <Image
              src={
                blockContent?.icon
                  ? blockContent.icon
                  : blockContent?.image
                  ? blockContent?.image
                  : background
              }
              height={1080}
              width={1920}
              alt="author-icon"
            />
          </div>
        )}
        <div className="name">
          <h2>
            {blockContent && blockContent?.title
              ? blockContent.title
              : blockContent?.username
              ? blockContent.username
              : "Нова категорія"}
          </h2>

          {type === "author" &&
            blockContent &&
            session?.user &&
            blockContent.id !== session.user.id && (
              <AuthorinfoWrite blockContent={blockContent} session={session} />
            )}

          {auhtorEdit && blockContent?.createdAt && (
            <p>Разом з нами від {formatTimeToPost(blockContent.createdAt)}</p>
          )}
        </div>

        {blockContent &&
          (type === "author" ? (
            blockContent?.aboutMe ? (
              <div className="disription">
                <p>{blockContent.aboutMe}</p>
              </div>
            ) : (
              <div className="disription">
                <p>
                  Ви зараз переглядаєте мій профіль за яким ви можете знайти
                  пости які я викладаю на цьому сайті. Приємного перегляду{" "}
                  {":)"}
                </p>
              </div>
            )
          ) : type === "tag" ? (
            blockContent?.desc ? (
              <div className="disription">
                <p>{blockContent.desc}</p>
              </div>
            ) : (
              <div className="disription">
                <p>
                  Ви зараз переглядаєте унікальний тег за яким ви можете знайти
                  пост такої самої тематики. Вдачі вам у ваших пошуках {":)"}
                </p>
              </div>
            )
          ) : type === "group" && blockContent?.desc ? (
            <div className="disription">
              <p>{blockContent.desc}</p>
            </div>
          ) : (
            <div className="disription">
              <p>
                Ви зараз переглядаєте унікальну групу за яким ви можете знайти
                пост такої самої тематики. Вдачі вам у ваших пошуках {":)"}
              </p>
            </div>
          ))}

        {type !== "tag" && type !== "author" && blockContent && (
          <>
            <div className="author-counters">
              <div className="item">
                <div className="count">
                  <p>
                    {blockContent?.subscriberCount &&
                    blockContent?.subscriberCount > 0
                      ? blockContent.subscriberCount
                      : 0}
                  </p>
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
        {auhtorEdit !== true ? (
          <div className="actions">
            <div className="list-of-actions">
              <div
                className={classNames("item", {
                  active: showMore !== true,
                })}
                onClick={() => {
                  if (setShowMore && setShowComments) {
                    setShowMore(false);
                    setShowComments(false);
                  }
                }}
              >
                <p>Записів</p>
              </div>
              {!currentUser && type !== "author" && (
                <div
                  className="item"
                  onClick={() => {
                    userSubscribed === true
                      ? onSubscribeCategory(false)
                      : onSubscribeCategory(true);
                  }}
                >
                  <p>
                    {userSubscribed === true ? "Відписатися" : "Відстежувати"}
                  </p>
                </div>
              )}
              {currentUser?.searchUser.id !== session?.user.id &&
                type === "author" &&
                session && (
                  <div
                    className="item"
                    onClick={() => {
                      userSubscribed != true
                        ? onFollowUser(true)
                        : onFollowUser(false);
                    }}
                  >
                    <p>
                      {userSubscribed != true ? "Відстежувати" : "Відписатися"}
                    </p>
                  </div>
                )}
              {type === "author" && (
                <>
                  <div
                    className={classNames("item", {
                      active: showComments !== false,
                    })}
                    onClick={() => {
                      if (setShowMore && setShowComments) {
                        setShowComments(true);
                        setShowMore(true);
                      }
                    }}
                  >
                    <p>Коментарі</p>
                  </div>

                  <div
                    className={classNames("item", {
                      active: showMore !== false,
                    })}
                    onClick={() => {
                      if (setShowMore && setShowComments) {
                        setShowMore(true);
                        setShowComments(false);
                      }
                    }}
                  >
                    <p>Більше</p>
                  </div>
                </>
              )}
            </div>
            {showMore !== true && (
              <div className="changer filter open-more">
                <div className="fafont-icon interactive">
                  <FontAwesomeIcon
                    onClick={() => setOpenFilter(openFilter ? false : true)}
                    icon={faAlignCenter}
                    style={{ width: "100%", height: "100%", color: "inherit" }}
                  />
                </div>
                <div
                  className={classNames(
                    "wrapper container flex-right width-auto",
                    {
                      active: openFilter,
                    }
                  )}
                >
                  <div className="triangle"></div>
                  <div className="list container flex-left width-auto">
                    {filterOptions.map(
                      (item: { key: string; text: string }, i: number) => (
                        <p
                          key={`${item}__${i}`}
                          className={classNames({
                            active: period === item.key,
                          })}
                          onClick={() => {
                            period !== item.key && setPeriod(item.key);
                            setOpenFilter(false);
                          }}
                        >
                          {item.text}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          currentUser?.searchUser !== null && <AuthorinfoEdit />
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
