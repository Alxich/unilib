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

  // Mutation hook for subscribing to a category
  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.subscribeToCategory);

  // Mutation hook for unsubscribing from a category
  const [unsubscribeToCategory] = useMutation<
    { unsubscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoriesOperations.Mutations.unsubscribeToCategory);

  // Mutation hook for following a user
  const [followUser] = useMutation<
    { followUser: FollowUserArguments },
    FollowUserArguments
  >(UserOperations.Mutations.followUser);

  /**
   * If type true its a category
   * or if false its a followers
   *
   * Effect to determine whether the current user
   * is subscribed to a certain item (category or user)
   */

  // Effect to determine whether the current user is subscribed to a certain item (category or user)
  useEffect(() => {
    // Check if the item type is not "false"
    if (itemType !== false) {
      // Skip the query if the item type is not "group"
      if (currentUser && currentUserLoading !== true) {
        // Get the array of subscribed category IDs from the current user
        const subscribedCategoryIDs =
          currentUser.searchUser.subscribedCategoryIDs;
        // Check if the current item's ID is present in the subscribedCategoryIDs array
        const isSubscribed = subscribedCategoryIDs.find(
          (categoryId) => "id" in item && categoryId === item.id
        );

        // Update the subscribed state based on whether the user is subscribed or not
        setSubscribed(isSubscribed ? true : false);
      }
    } else {
      // Handle the case when the item type is "false" (referring to user subscription)
      if (currentUser && currentUserLoading !== true) {
        // Get the array of subscribed user IDs from the current user
        const subscribedUserIDs = currentUser.searchUser.followedBy;
        // Check if the current item's ID is present in the subscribedUserIDs array
        const isSubscribed = subscribedUserIDs?.find(
          (userId) => "id" in item && userId.follower.id === item.id
        );

        // Update the subscribed state based on whether the user is subscribed or not
        setSubscribed(isSubscribed ? true : false);
      }
    }
  }, [currentUserLoading, currentUser, item, itemType]);

  /**
   * Function to handle subscription/unsubscriptio
   */

  const onSubscribe = async (type: boolean, elementId: string) => {
    if (itemType !== true) {
      /**
       * When user smash the button we asign or remove from folowing the user
       * If itemType is not true, it's a user subscription
       */
      try {
        // Check if user is authenticated
        if (!session) {
          throw new Error("Not authorized Session");
        }

        const { username, id: userId } = session.user;

        // Check if user data exists to ensure post security
        if (!username) {
          throw new Error("Not authorized user");
        }

        // Ensure currentUser data is available
        if (!currentUser) {
          throw new Error("Not authorized user");
        }

        // Data for following a user
        const subscribeData: FollowUserArguments = {
          followerId: userId,
          followingId: elementId,
        };

        // Follow the user
        const { data, errors } = await followUser({
          variables: {
            ...subscribeData,
          },
        });

        if (!data?.followUser || errors) {
          throw new Error("Error following user");
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
       * If itemType is true, it's a category subscription
       */
      try {
        // Check if user is authenticated
        if (!session) {
          throw new Error("Not authorized Session");
        }

        const { username, id: userId } = session.user;

        // Check if user data exists to ensure post security
        if (!username) {
          throw new Error("Not authorized user");
        }

        // Data for subscribing/unsubscribing to a category
        const subscribeData: SubscribeCategoryArguments = {
          categoryId: elementId,
          userId,
        };

        if (type === false) {
          // Subscribe to the category
          const { data, errors } = await subscribeToCategory({
            variables: {
              ...subscribeData,
            },
          });

          // We cant operate during we have not all the data we needed
          if (!data?.subscribeToCategory || errors) {
            throw new Error("Error subscribing to category");
          }

          if (!errors) {
            toast.success("Category was subscribed!");
            setSubscribed(true);
          }
        } else {
          // Unsubscribe from the category
          const { data, errors } = await unsubscribeToCategory({
            variables: {
              ...subscribeData,
            },
          });

          // We cant operate during we have not all the data we needed
          if (!data?.unsubscribeToCategory || errors) {
            throw new Error("Error unsubscribing from category");
          }

          if (!errors) {
            toast.success("Category was unsubscribed!");
            setSubscribed(false);
          }
        }
      } catch (error: any) {
        // If any error occures during this function we explain it to our user
        console.error("onSubscribeCategory error", error);
        toast.error(error?.message);
      }
    }
  };

  // Function to handle subscription button click
  const handleSubscribe = () => {
    /**
     * If itemType is truthy (category or group),
     * check if "id" is in item and call onSubscribe
     *
     * If itemType is falsy (user),
     * check if subscribed is not true and call onSubscribe
     */
    itemType
      ? itemType && "id" in item && onSubscribe(subscribed, item.id)
      : subscribed != true && onSubscribe(subscribed, session.user.id);
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
