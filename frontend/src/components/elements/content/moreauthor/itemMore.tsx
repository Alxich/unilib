import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import Button from "../../_button";
import { toast } from "react-hot-toast";

import { Session } from "next-auth";
import { useMutation } from "@apollo/client";
import {
  CategoryDataByUser,
  FollowUserArguments,
  Followers,
  SearchUserData,
  SubscribeCategoryArguments,
} from "../../../../util/types";
import { CategoryPopulated } from "../../../../../../backend/src/util/types";
import CategoriesOperations from "../../../../graphql/operations/categories";
import UserOperations from "../../../../graphql/operations/users";

interface ItemProps {
  itemType: boolean;
  session: Session;
  item: CategoryDataByUser | Followers;
  currentUser: SearchUserData | undefined;
  currentUserLoading: boolean;
}

const ItemMore: FC<ItemProps> = ({
  session,
  item,
  itemType,
  currentUser,
  currentUserLoading,
}) => {
  const [subscribed, setSubscribed] = useState(false);

  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.subscribeToCategory);

  const [unsubscribeToCategory] = useMutation<
    { unsubscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.unsubscribeToCategory);

  const [followUser] = useMutation<
    { followUser: FollowUserArguments },
    FollowUserArguments
  >(UserOperations.Mutations.followUser);

  /**
   * If type true its a category
   * or if false its a followers
   */

  useEffect(() => {
    if (itemType !== false) {
      // Skip the query if the type is not "group"
      if (currentUser && currentUserLoading != true) {
        const subscribedCategoryIDs =
          currentUser.searchUser.subscribedCategoryIDs;
        const isSubscribed = subscribedCategoryIDs.find(
          (categoryId) => "id" in item && categoryId === item.id
        );

        setSubscribed(isSubscribed ? true : false);
      }
    } else {
      if (currentUser && currentUserLoading != true) {
        const subscribedUserIDs = currentUser.searchUser.followedBy;
        const isSubscribed = subscribedUserIDs?.find(
          (userId) => "id" in item && userId.follower.id === item.id
        );

        setSubscribed(isSubscribed ? true : false);
      }
    }
  }, [currentUserLoading, currentUser, item, itemType]);

  /**
   * When user subscribe to cateogory
   */
  const onSubscribe = async (type: boolean, elementId: string) => {
    if (itemType != true) {
      /**
       * When user smash the button we asign or remove from folowing the user
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

        if (!currentUser) {
          throw new Error("Not authorized user");
        }

        const subscribeData: FollowUserArguments = {
          followerId: userId,
          followingId: elementId,
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
          setSubscribed(true);
        }
      } catch (error: any) {
        console.error("onFollowUser error", error);
        toast.error(error?.message);
      }
    } else {
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

        const subscribeData: SubscribeCategoryArguments = {
          categoryId: elementId,
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
            setSubscribed(true);
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
            setSubscribed(false);
          }
        }
      } catch (error: any) {
        console.error("onSubscribeCategory error", error);
        toast.error(error?.message);
      }
    }
  };

  const handleSubscribe = () => {
    itemType
      ? itemType && "id" in item && onSubscribe(subscribed, item.id)
      : subscribed != true && onSubscribe(subscribed, session.user.id);

    console.log(subscribed);
  };

  return (
    <div className="item">
      <div className="icon">
        {itemType && "icon" in item ? (
          <Image
            src={item.icon}
            alt={`${item.id}__${item.icon}`}
            height={100}
            width={100}
          />
        ) : (
          itemType != true &&
          "following" in item &&
          item.following.image && (
            <Image
              src={item.following.image}
              alt={`${item.following.id}__${item.following.image}`}
              height={100}
              width={100}
            />
          )
        )}
      </div>
      <div className="name">
        {itemType && "id" in item ? (
          <Link href={`/group/${item.id}`}>{item.title}</Link>
        ) : (
          itemType != true &&
          "following" in item && (
            <Link href={`/author/${item.following.id}`}>
              {item.following.username}
            </Link>
          )
        )}
      </div>
      {itemType != true ? (
        subscribed != true &&
        "following" in item &&
        item.following.id !== session.user.id && (
          <Button small filled onClick={handleSubscribe}>
            <div className="fafont-icon big">
              <FontAwesomeIcon
                icon={subscribed !== false ? faPlus : faXmark}
                style={{
                  width: "100%",
                  height: "100%",
                  color: "inherit",
                }}
              />
            </div>
          </Button>
        )
      ) : (
        <Button small filled onClick={handleSubscribe}>
          <div className="fafont-icon big">
            <FontAwesomeIcon
              icon={subscribed === true ? faXmark : faPlus}
              style={{
                width: "100%",
                height: "100%",
                color: "inherit",
              }}
            />
          </div>
        </Button>
      )}
    </div>
  );
};

export default ItemMore;
