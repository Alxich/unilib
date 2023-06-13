import { FC, useEffect, useState } from "react";
import { Session } from "next-auth";

import { toast } from "react-hot-toast";

import { useMutation, useQuery } from "@apollo/client";
import CategoriesOperations from "../../../graphql/operations/categories";
import UserOperations from "../../../graphql/operations/users";

import {
  CategoriesData,
  CategoryDataByUser,
  FollowUserArguments,
  Followers,
  SearchUserData,
  SearchUserVariables,
  SubscribeCategoryArguments,
} from "../../../util/types";
import { CategoryPopulated } from "../../../../../backend/src/util/types";

import { ItemMore } from "./moreauthor";

interface MoreAuthorProps {
  id: string;
  session: Session;
}

const MoreAuthor: FC<MoreAuthorProps> = ({ id, session }: MoreAuthorProps) => {
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [userFollowed, setUserFollowed] = useState(false);
  const [categories, setCategories] = useState<CategoriesData>();
  const [users, setUsers] = useState<Followers[]>();
  const [loading, setLoading] = useState(true);

  const itemInfo = [1, 2];

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<CategoriesData>(
      CategoriesOperations.Queries.queryCategoriesByUser,
      {
        variables: {
          id,
        },
        onError: (error) => {
          toast.error(`Error loading categories: ${error}`);
          console.error("Error in queryCategoriesByUser func", error);
        },
      }
    );

  useEffect(() => {
    if (categoriesLoading !== true && categoriesData) {
      setCategories(categoriesData);
      setLoading(false);
    }
  }, [categoriesData, categoriesLoading]);

  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.subscribeToCategory);

  const [unsubscribeToCategory] = useMutation<
    { unsubscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.unsubscribeToCategory);

  const onSubscribeCategory = async (type: boolean, categoryId: string) => {
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
        categoryId,
        userId,
      };

      if (type === false) {
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
          setUserSubscribed(false);
        }
      }
    } catch (error: any) {
      console.error("onSubscribeCategory error", error);
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
    skip: !session,
    onError: (error) => {
      toast.error(`Error loading user: ${error}`);
      console.error("Error in searchUser func", error);
    },
  });

  useEffect(() => {
    if (currentUser && currentUserLoading != true) {
      if (session) {
        const subscribedUsers = currentUser.searchUser.followedBy;
        if (subscribedUsers) {
          setUsers(subscribedUsers);
        }
      } else {
        console.error("Not authorized Session");
        setUserFollowed(false);
      }
    }
  }, [currentUserLoading, currentUser, id, session]);

  const [followUser] = useMutation<
    { followUser: FollowUserArguments },
    FollowUserArguments
  >(UserOperations.Mutations.followUser);

  const onFollowUser = async (type: boolean, followingId: string) => {
    try {
      if (type != false) {
        throw new Error("You already assigned");
      }

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
        followingId,
      };

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
        setUserFollowed(true);
      }
    } catch (error: any) {
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="author-more" className="container">
      {itemInfo.map((item, i) => {
        return item != 2
          ? categories && categories.queryCategoriesByUser.length > 0 && (
              <div className="info-item post-wrapper" key={`${item}__${i}`}>
                <div className="title">
                  <h3>{item != 2 ? "Стежує" : "Стежувачі"}</h3>
                  <p className="count">72</p>
                </div>
                <div className="list container flex-row flex-stretch flex-wrap flex-space full-width">
                  {categories.queryCategoriesByUser.map(
                    (item: CategoryDataByUser, i: number) => (
                      <ItemMore
                        session={session}
                        type={true}
                        item={item as CategoryDataByUser}
                        onSubscribe={onSubscribeCategory}
                        subscribed={userSubscribed}
                        key={`${item.id}__${i}`}
                      />
                    )
                  )}
                </div>
                <div className="actions">
                  <p>Дізнатися більше</p>
                  <p>Відкрити усі</p>
                </div>
              </div>
            )
          : users && users.length > 0 && (
              <div className="info-item post-wrapper" key={`${item}__${i}`}>
                <div className="title">
                  <h3>{item != 2 ? "Стежує" : "Стежувачі"}</h3>
                  <p className="count">72</p>
                </div>
                <div className="list container flex-row flex-stretch flex-wrap flex-space full-width">
                  {users.map((item: Followers, i: number) => (
                    <ItemMore
                      session={session}
                      type={false}
                      item={item as Followers}
                      onSubscribe={onFollowUser}
                      subscribed={userFollowed}
                      key={`${item.follower.id}__${i}`}
                    />
                  ))}
                </div>
                <div className="actions">
                  <p>Дізнатися більше</p>
                  <p>Відкрити усі</p>
                </div>
              </div>
            );
      })}
    </div>
  );
};

export default MoreAuthor;
