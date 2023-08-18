import { FC, useEffect, useState } from "react";
import { Session } from "next-auth";

import { toast } from "react-toastify";

import { useQuery } from "@apollo/client";
import CategoriesOperations from "../../../graphql/operations/categories";
import UserOperations from "../../../graphql/operations/users";

import {
  CategoriesByUserData,
  CategoryDataByUser,
  Followers,
  SearchUserData,
  SearchUserVariables,
} from "../../../util/types";

import { ItemMore } from "./moreauthor";

interface MoreAuthorProps {
  id: string;
  session: Session;
}

const MoreAuthor: FC<MoreAuthorProps> = ({ id, session }: MoreAuthorProps) => {
  const [categories, setCategories] = useState<CategoriesByUserData>();
  const [users, setUsers] = useState<Followers[]>();
  const [loading, setLoading] = useState(true);

  const itemInfo = [1, 2];

  // Query data for categories by user using the useQuery hook
  const {
    data: CategoriesByUserData, // Retrieved data for categories
    loading: categoriesLoading, // Loading status for categories data
  } = useQuery<CategoriesByUserData>(
    CategoriesOperations.Queries.queryCategoriesByUser, // The name of the query
    {
      variables: {
        id, // The user ID variable for the query
      },
      // Handle errors during the query
      onError: (error) => {
        // Display an error toast message with the error details
        toast.error(`Error loading categories: ${error}`);
        // Log the error details to the console
        console.error("Error in queryCategoriesByUser function", error);
      },
    }
  );

  // useEffect hook to update state when category data is available
  useEffect(() => {
    // Check if category data is loaded and not in a loading state
    if (categoriesLoading !== true && CategoriesByUserData) {
      // Set the categories state with the retrieved category data
      setCategories(CategoriesByUserData);
      // Set the loading state to false since data is available
      setLoading(false);
    }
  }, [CategoriesByUserData, categoriesLoading]);

  // Use the useQuery hook to fetch data about the current user
  const { data: currentUser, loading: currentUserLoading } = useQuery<
    SearchUserData,
    SearchUserVariables
  >(UserOperations.Queries.searchUser, {
    variables: {
      id: session?.user.id || "", // Provide the user's ID from the session, or an empty string if no session
    },
    skip: !session, // Skip the query if there's no session
    onError: (error) => {
      toast.error(`Error loading user: ${error}`);
      console.error("Error in loading func", error);
    },
  });

  // Use an effect to process the fetched user data and update the component's state
  useEffect(() => {
    if (currentUser && currentUserLoading !== true) {
      if (session) {
        // Extract the list of subscribed users from the fetched user data
        const subscribedUsers = currentUser.searchUser.followedBy;

        if (subscribedUsers) {
          // Update the component's state with the list of subscribed users
          setUsers(subscribedUsers);
        }
      } else {
        console.error("Not authorized Session");
        // If there's no session, clear the list of users in the component's state
        setUsers([]);
      }
    }
  }, [currentUserLoading, currentUser, id, session]);

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
                        itemType={true}
                        item={item as CategoryDataByUser}
                        currentUser={currentUser}
                        currentUserLoading={currentUserLoading}
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
                      itemType={false}
                      item={item as Followers}
                      currentUser={currentUser}
                      currentUserLoading={currentUserLoading}
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
