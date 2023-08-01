import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { toast } from "react-hot-toast";
import classNames from "classnames";
import Image from "next/image";
import background from "../../../../public/images/background.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faPenClip } from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";
import { useMutation, useQuery } from "@apollo/client";

import {
  AuthorInfoTypes,
  CategoriesVariables,
  CategoryData,
  ConversationCreatedSubscriptionData,
  ConversationsData,
  CreateConversationData,
  DeleteItemResoponse,
  FollowUserArguments,
  SearchUserData,
  SearchUserVariables,
  SearchedUser,
  SubscribeCategoryArguments,
  TagData,
  TagsVariables,
  UpdateItemResoponse,
  UpdateUserArguments,
} from "../../../util/types";

import CategoryOperations from "../../../graphql/operations/categories";
import TagOperations from "../../../graphql/operations/tags";
import UserOperations from "../../../graphql/operations/users";
import {
  CategoryPopulated,
  ConversationPopulated,
} from "../../../../../backend/src/util/types";
import Button from "../_button";
import { formatTimeToPost } from "../../../util/functions";

import ConversationOperations from "../../../graphql/operations/conversations";
import { useRouter } from "next/router";

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
   * Edit variables for creating edit page
   */

  const [username, setUsername] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    if (blockContent) {
      const { username, aboutMe, banner, image } = blockContent;

      username && setUsername(username);
      aboutMe && setDesc(aboutMe);
      image && setImage(image);
      banner && setBanner(banner);
    }
  }, [blockContent]);

  const [updateProccessing, setUpdateProccessing] = useState<boolean>(false);
  const cooldownTimeInSeconds = 5; // Length of cooldown time
  const [cooldown, setCooldown] = useState<number>(cooldownTimeInSeconds);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCooldownActive) {
      interval = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCooldownActive]);

  useEffect(() => {
    cooldown === 0 && stopCooldown();
  }, [cooldown]);

  // Start counting cooldown
  const startCooldown = () => {
    setCooldown(cooldownTimeInSeconds);
    setIsCooldownActive(true);
  };

  // End counting cooldown (For extra situation)
  const stopCooldown = () => {
    setIsCooldownActive(false);
  };

  const [updateUser] = useMutation<
    { updateUser: UpdateItemResoponse },
    UpdateUserArguments
  >(UserOperations.Mutations.updateUser);

  const onUpdateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setUpdateProccessing(true);
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username: sessionUsername, id: userId } = session.user;

      // Check if user exist to make post secure
      if (!sessionUsername) {
        throw new Error("Not authorized user");
      }

      if (!currentUser) {
        throw new Error("Not authorized user");
      }

      const { data, errors } = await updateUser({
        variables: {
          banner,
          desc,
          image,
          username,
        },
      });

      if (!data?.updateUser.success || errors) {
        setUpdateProccessing(false);
        throw new Error("Error to update user");
      }

      if (!errors) {
        toast.success("User was updated!");
        setUpdateProccessing(false);
        startCooldown();
      }
    } catch (error: any) {
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  /**
   * Create conversation functions
   */

  /**
   * Query all conversations to check existing conversations with user
   */
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  if (conversationsError) {
    toast.error("There was an error fetching conversations");
  }

  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  const router = useRouter();

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutations.createConversation
    );

  /**
   * Verifies that a conversation with selected
   * participants does not already exist
   */
  const findExistingConversation = (participantIds: Array<string>) => {
    let existingConversation: ConversationPopulated | null = null;

    if (!conversationsData) return true;

    for (const conversation of conversationsData.conversations) {
      const addedParticipants = conversation.participants.filter(
        (p) => p.user.id !== session?.user.id
      );

      if (addedParticipants.length === participantIds.length) {
        continue;
      }

      let allMatchingParticipants: boolean = false;
      for (const participant of addedParticipants) {
        const foundParticipant = participantIds.find(
          (p) => p === participant.user.id
        );

        if (!foundParticipant) {
          allMatchingParticipants = false;
          break;
        }

        /**
         * If we hit here,
         * all match
         */
        allMatchingParticipants = true;
      }

      if (allMatchingParticipants) {
        existingConversation = conversation;
      }
    }

    return existingConversation;
  };

  const onCreateConversation = async () => {
    try {
      if (!session?.user.id)
        throw new Error("Failed to create conversation | Not authorized");

      const participantIds = [...participants.map((p) => p.id)];

      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });

      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;

      router.push(`/messages/chat/${conversationId}`);
    } catch (error: any) {
      console.error("createConversations error", error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (users: SearchedUser[]) => {
    setParticipants(users);
  };

  useEffect(() => {
    if (blockContent?.username && blockContent?.id && session?.user) {
      addParticipant([
        {
          id: blockContent.id,
          username: blockContent.username,
        },
        {
          id: session.user.id,
          username: session.user.username,
        },
      ]);
    }
  }, [blockContent, session]);

  const onSubmit = () => {
    if (!participants.length) {
      toast.error("Error to create a new conversation");
      return;
    }

    const participantIds = participants.map((p) => p.id);

    const existing = findExistingConversation(
      participantIds
    ) as ConversationPopulated | null;

    if (existing) {
      router.push(`/messages/chat/${existing.id}`);
      return;
    }

    onCreateConversation();
  };

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
              <Button
                filled
                small
                writeAuthor
                loading={createConversationLoading}
                iconIncluded
                disabled={!participants}
                iconName={faPenClip}
                onClick={() => onSubmit()}
              >
                Написати
              </Button>
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
                    onClick={() => setShowComments && setShowComments(true)}
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
          currentUser?.searchUser !== null && (
            <div className="edit">
              <div className="title">
                <h5>Настройки користувача</h5>
              </div>
              <form>
                <div className="item">
                  <div className="title">
                    <p>Змінити ім{"`"}я користувача</p>
                  </div>
                  <input
                    placeholder={`Your current username: ${currentUser?.searchUser.username}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="item">
                  <div className="title">
                    <p>Змінити опис користувача</p>
                  </div>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <div className="item">
                  <div className="title">
                    <p>Ваш email до якого привязаний аккаунт</p>
                  </div>
                  <input value={currentUser?.searchUser.email} disabled />
                </div>
                <div className="item">
                  <div className="title">
                    <p>Змінити іконку користувача</p>
                  </div>
                  <input
                    placeholder={`Your current image: ${currentUser?.searchUser.image}`}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div className="item">
                  <div className="title">
                    <p>Змінити баннер користувача</p>
                  </div>
                  <input
                    placeholder={`Your current banner: ${currentUser?.searchUser.banner}`}
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                </div>
                <div className="item">
                  <div className="title">
                    <p>Змінити пороль користувача</p>
                  </div>
                  <div>
                    <input
                      placeholder={"Please write your current password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                      placeholder={"Write your new password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="item update">
                  <div className="title">
                    <p>Оновити ваші нові дані користувача</p>
                  </div>
                  <Button
                    filled
                    big
                    onClick={(e: any) => {
                      onUpdateUser(e);
                    }}
                    disabled={isCooldownActive || updateProccessing}
                  >
                    {isCooldownActive ? `Оновити (${cooldown}сек)` : "Оновити"}
                  </Button>
                </div>
              </form>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
