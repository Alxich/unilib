import { FC, SetStateAction, createContext, useEffect, useState } from "react";
import type { NextPageContext } from "next";
import Head from "next/head";
import classNames from "classnames";
import { Toaster, toast } from "react-hot-toast";
import { getSession, useSession } from "next-auth/react";
import { Header, Banner, Sidebar, Reels, WritterPost } from "../components";
import { useQuery, useSubscription } from "@apollo/client";
import CategoriesOperations from "../graphql/operations/categories";
import UsersOperations from "../graphql/operations/users";
import {
  CategoriesData,
  ContentViewChanger,
  ContentViews,
  SearchUserData,
  SearchUserVariables,
  UserSubscriptionData,
} from "../util/types";

interface ContentProps {
  children: any;
}

type ContentContextValue = [
  ContentViews,
  React.Dispatch<React.SetStateAction<ContentViews>>
];

export const ContentContext = createContext<ContentContextValue>([
  "popular",
  () => {},
]);

export const UserContext = createContext<
  [
    string[] | undefined,
    React.Dispatch<React.SetStateAction<string[] | undefined>>
  ]
>([[], () => {}]);

const Content: FC<ContentProps> = ({ children }: ContentProps) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [bannerActive, setBannerActive] = useState(false);
  const [writterActive, setWritterActive] = useState(false);
  const [userSigned, setUserSigned] = useState(false);
  const [period, setPeriod] = useState<ContentViews>("popular");
  const [userSubscribed, setUserSubscribed] = useState<string[] | undefined>();

  const { data: session } = useSession();

  useEffect(() => {
    writterActive
      ? document.body.classList.add("writter-active")
      : document.body.classList.remove("writter-active");
  }, [writterActive]);

  useEffect(() => {
    setBannerActive(session?.user ? false : true);
  }, [session]);

  const changeView: ContentViewChanger[] = [
    {
      icon: "faFire",
      iconTypeFaFont: true,
      link: "popular",
      title: "Популярне",
    },
    {
      icon: "faClock",
      iconTypeFaFont: true,
      link: "today",
      title: "Нове у треді",
    },
    {
      icon: "faNewspaper",
      iconTypeFaFont: true,
      link: "follow",
      title: "Моя стрічка",
    },
  ];

  const { data: categories, loading: categoriesLoading } =
    useQuery<CategoriesData>(CategoriesOperations.Queries.queryCategories);

  const { data: userFetch, loading: userLoading } = useQuery<
    SearchUserData,
    SearchUserVariables
  >(UsersOperations.Queries.searchUser, {
    variables: {
      id: session ? session.user.id : "",
    },
    skip: !session,
    onCompleted(data) {
      const userSubscribed = data?.searchUser.subscribedCategoryIDs;

      if (userSubscribed) {
        setUserSigned(userSubscribed.length > 0 ? true : false);
        setUserSubscribed(userSubscribed);
      }
    },
    onError: (error) => {
      toast.error(`Error loading categories: ${error}`);
      console.error("Error in queryCategory func", error);
    },
  });

  const { data: newUserData, loading: userUpdatedLoading } =
    useSubscription<UserSubscriptionData>(
      CategoriesOperations.Subscriptions.userUpdated
    );

  useEffect(() => {
    const userSubscribed = newUserData?.userUpdated.subscribedCategoryIDs;
    console.log(userSubscribed, userUpdatedLoading !== true);

    if (userSubscribed && userUpdatedLoading !== true) {
      setUserSigned(userSubscribed.length > 0 ? true : false);
      setUserSubscribed(userSubscribed);
    }
  }, [userUpdatedLoading, newUserData]);

  useEffect(() => {
    setLoadingStatus(categoriesLoading);
  }, [categoriesLoading]);

  useEffect(() => {
    setLoadingStatus(userLoading);
  }, [userLoading]);

  useEffect(() => {
    setLoadingStatus(userUpdatedLoading);
  }, [userUpdatedLoading]);

  return (
    <>
      <Head>
        <title>UNILIB - Український форум</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && (
        <>
          <Header
            setBannerActive={setBannerActive}
            session={session}
            writterActive={writterActive}
            setWritterActive={setWritterActive}
          />
          <main
            className={classNames("main", {
              "writter-active": writterActive,
            })}
          >
            <div className="container main-content flex-row flex-space">
              {loadingStatus ? (
                "loading"
              ) : (
                <>
                  <Sidebar
                    categories={changeView}
                    fandoms={categories?.queryCategories}
                    setPeriod={setPeriod}
                    userSigned={userSigned}
                  />
                  <div id="content" className="container">
                    <ContentContext.Provider value={[period, setPeriod]}>
                      <UserContext.Provider
                        value={[userSubscribed, setUserSubscribed]}
                      >
                        {children}
                      </UserContext.Provider>
                    </ContentContext.Provider>
                  </div>
                  <Reels />
                </>
              )}
            </div>
          </main>
        </>
      )}
      <Banner
        bannerActive={bannerActive}
        setBannerActive={setBannerActive}
        session={session}
      />
      {session && (
        <WritterPost
          session={session}
          writterActive={writterActive}
          setWritterActive={setWritterActive}
        />
      )}

      <footer className={"colophon"}></footer>
      <div>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
}

export default Content;
