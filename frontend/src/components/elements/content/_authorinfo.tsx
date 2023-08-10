import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
     * When user smash the button we asign or
     * remove from folowing the category
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
      console.error("onSubscribeCategory error", error);
      toast.error(error?.message);
    }
  };

  const {
    data: currentUser,
    loading: currentUserLoading,
    refetch: refetchUser,
  } = useQuery<SearchUserData, SearchUserVariables>(
    UserOperations.Queries.searchUser,
    {
      variables: {
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
        setBlockContent({ ...data.searchUser });
      },
      onError: (error) => {
        toast.error(`Error loading user: ${error}`);
        console.error("Error in searchUser func", error);
      },
    }
  );

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: refetchCategory,
  } = useQuery<CategoryData, CategoriesVariables>(
    CategoryOperations.Queries.queryCategory,
    {
      variables: {
        id: id,
      },
      skip: type !== "group", // Skip the query if the type is not "group"
      onCompleted(data) {
        setBlockContent({ ...data.queryCategory });
      },
      onError: (error) => {
        toast.error(`Error on loading category ${error}`);
        console.error("Error queryCategory func", error);
      },
    }
  );

  const {
    data: tagData,
    loading: tagLoading,
    refetch: refetchTag,
  } = useQuery<TagData, TagsVariables>(TagOperations.Queries.queryTag, {
    variables: {
      id: id,
    },
    skip: type !== "tag", // Skip the query if the type is not "tag"
    onCompleted(data) {
      setBlockContent({ ...data.queryTag });
    },
    onError: (error) => {
      toast.error(`Error on loading category ${error}`);
      console.error("Error queryCategory func", error);
    },
  });

  useEffect(() => {
    switch (type) {
      case "author": {
        refetchUser();
        break;
      }
      case "group": {
        refetchCategory();
        break;
      }
      case "tag": {
        refetchTag();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [followUser] = useMutation<
    { followUser: FollowUserArguments },
    FollowUserArguments
  >(UserOperations.Mutations.followUser);

  const [unfollowUser] = useMutation<
    { unfollowUser: DeleteItemResoponse },
    FollowUserArguments
  >(UserOperations.Mutations.unfollowUser);

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

      if (!currentUser) {
        throw new Error("Not authorized user");
      }

      const subscribeData: FollowUserArguments = {
        followerId: userId,
        followingId: currentUser.searchUser.id,
      };

      if (type === true) {
        const { data, errors } = await followUser({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.followUser || errors) {
          throw new Error("Error follow user");
        }

        if (!errors) {
          toast.success("User was followed!");
          setUserSubscribed(true);
        }
      } else {
        const { data, errors } = await unfollowUser({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.unfollowUser.success || errors) {
          throw new Error("Error unfolow user");
        }

        if (!errors) {
          toast.success("User was unfolowed!");
          setUserSubscribed(false);
        }
      }
    } catch (error: any) {
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (type !== "author" && type !== "tag") {
      if (categoryData && categoryLoading != true) {
        if (session) {
          const subscribedUsers = categoryData.queryCategory.subscribers;
          const { id } = session.user;

          if (session && categoryData.queryCategory) {
            const isSubscribed = subscribedUsers.find(
              (follow) => follow.id === id
            );

            setUserSubscribed(isSubscribed ? true : false);
          } else {
            setUserSubscribed(true);
          }
        }
      } else {
        console.error("Not authorized Session");
        setUserSubscribed(false);
      }
    } else if (type === "author") {
      if (currentUser?.searchUser && currentUserLoading != true) {
        if (session) {
          const subscribedUsers = currentUser.searchUser.followedBy;
          const { id } = session.user;

          if (subscribedUsers) {
            const isSubscribed = subscribedUsers.find(
              (follow) => follow.follower.id === id
            );
            setUserSubscribed(isSubscribed ? true : false);
          } else {
            setUserSubscribed(true);
          }
        } else {
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

  /**
   * Create conversation loading state
   */

  const [conversationsLoading, setConversationsLoading] =
    useState<boolean>(false);

  return categoryLoading || conversationsLoading ? (
    <div>Loading</div>
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
              <AuthorinfoWrite
                setConversationsLoading={setConversationsLoading}
                blockContent={blockContent}
                session={session}
              />
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
