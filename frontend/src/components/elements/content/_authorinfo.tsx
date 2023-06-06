import { FC, useEffect, useState } from "react";
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
} from "../../../util/types";

import CategoryOperations from "../../../graphql/operations/categories";
import UserOperations from "../../../graphql/operations/users";
import { CategoryPopulated } from "../../../../../backend/src/util/types";

interface AuthorInfoProps {
  id: string;
  session: Session | null;
}

const AuthorInfo: FC<AuthorInfoProps> = ({ session, id }: AuthorInfoProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [category, setCategory] = useState<CategoryDataById>();

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
          setCategory(data.subscribeToCategory);
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
          setCategory(data.unsubscribeToCategory);
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
    skip: !session, // Skip the query when sessionUser is null or undefined
    onError: (error) => {
      toast.error(`Error loading user: ${error}`);
      console.log("Error in queryCategory func", error);
    },
  });

  useEffect(() => {
    if (currentUser && currentUserLoading != true) {
      const subscribedCategoryIDs =
        currentUser.searchUser.subscribedCategoryIDs;
      const isSubscribed = subscribedCategoryIDs.find(
        (categoryId) => categoryId === id
      );

      setUserSubscribed(isSubscribed ? true : false);
    }
  }, [currentUserLoading, currentUser, id, session]);

  const { data: categoryData, loading } = useQuery<
    CategoryData,
    CategoriesVariables
  >(CategoryOperations.Queries.queryCategory, {
    variables: {
      id: id,
    },
    onError: (error) => {
      toast.error(`Error on loading category ${error}`);
      console.log("Error queryCategory func", error);
    },
  });

  useEffect(() => {
    loading !== true && categoryData && setCategory(categoryData.queryCategory);
  }, [categoryData, loading]);

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="author-info" className="container">
      <div className="banner">
        <Image
          src={category ? category.banner : background}
          height={1080}
          width={1920}
          alt="author-background"
        />
      </div>
      <div className="info post-wrapper">
        <div className="icon">
          <Image
            src={category ? category.icon : background}
            height={1080}
            width={1920}
            alt="author-icon"
          />
        </div>
        <div className="name">
          <h2>{category ? category.title : "Нова категорія"}</h2>
        </div>
        <div className="disription">
          <p>{category ? category.desc : "Тут могла бути ваша реклама"}</p>
        </div>
        <div className="author-counters">
          <div className="item">
            <div className="count">
              <p>{category ? category.subscriberCount : 0}</p>
            </div>
            <div className="title">
              <p>стежувачів</p>
            </div>
          </div>
          {category === null && (
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
            {category === null && (
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
                <p>По даті</p>
                <p>По популярності</p>
                <p>За рейтингом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
