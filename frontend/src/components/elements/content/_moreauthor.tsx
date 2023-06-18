import { FC, useEffect, useState } from "react";
import { Session } from "next-auth";

import { toast } from "react-hot-toast";

import { useQuery } from "@apollo/client";
import CategoriesOperations from "../../../graphql/operations/categories";
import UserOperations from "../../../graphql/operations/users";

import {
  CategoriesData,
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
      console.error("Error in loading func", error);
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
