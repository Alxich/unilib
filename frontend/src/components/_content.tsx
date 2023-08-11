import { FC, SetStateAction, createContext, useEffect, useState } from "react";
import type { NextPageContext } from "next";
import Head from "next/head";
import classNames from "classnames";
import { Toaster, toast } from "react-hot-toast";
import {
  Header,
  Banner,
  Sidebar,
  Reels,
  WritterPost,
  MessagesBar,
  Post,
} from "../components";

import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useQuery, useSubscription } from "@apollo/client";
import PostsOperations from "../graphql/operations/posts";
import CategoriesOperations from "../graphql/operations/categories";
import UsersOperations from "../graphql/operations/users";
import {
  CategoriesData,
  ContentViewChanger,
  ContentViews,
  PostsSearchVariables,
  PostsSearchgData,
  SearchUserData,
  SearchUserVariables,
  UserSubscriptionData,
} from "../util/types";
import { PostPopulated } from "../../../backend/src/util/types";
import { Postloading } from "./skeletons";

interface ContentProps {
  children: any;
}

type ContentContextValue = [
  ContentViews,
  React.Dispatch<SetStateAction<ContentViews>>
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
  const [bagReportActive, setBagReportActive] = useState(false);
  const [period, setPeriod] = useState<ContentViews>("popular");
  const [userSubscribed, setUserSubscribed] = useState<string[] | undefined>();

  const { data: session } = useSession();

  // Initialize Next.js router and check if the current route is related to messages

  const router = useRouter();
  const isMessagesRoute = router.pathname.startsWith("/messages");

  // Apply CSS class based on writterActive state

  useEffect(() => {
    writterActive
      ? document.body.classList.add("writter-active")
      : document.body.classList.remove("writter-active");
  }, [writterActive]);

  // Set bannerActive based on user session

  useEffect(() => {
    setBannerActive(session?.user ? false : true);
  }, [session]);

  // Content view change options

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

  // Fetch categories using useQuery hook

  const { data: categories, loading: categoriesLoading } =
    useQuery<CategoriesData>(CategoriesOperations.Queries.queryCategories);

  // Fetch user data and subscribed categories

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

  // Subscribe to user updates using useSubscription hook

  const { data: newUserData, loading: userUpdatedLoading } =
    useSubscription<UserSubscriptionData>(
      CategoriesOperations.Subscriptions.userUpdated
    );

  // Update userSubscribed based on subscription data

  useEffect(() => {
    const userSubscribed = newUserData?.userUpdated.subscribedCategoryIDs;

    if (userSubscribed && userUpdatedLoading !== true) {
      setUserSigned(userSubscribed.length > 0 ? true : false);
      setUserSubscribed(userSubscribed);
    }
  }, [userUpdatedLoading, newUserData]);

  /**
   * There is query where loads only while user filled some text in input
   * Before it must not query to give more app loading perfomance
   */

  const [searchResults, setSearchResults] = useState<
    PostPopulated[] | undefined
  >([]);
  const [searchText, setSearchText] = useState<string | undefined>();

  // Fetch posts based on search text

  const { data: postsSearch, loading: postLoading } = useQuery<
    PostsSearchgData,
    PostsSearchVariables
  >(PostsOperations.Queries.querySearchPosts, {
    variables: {
      searchText: searchText ? searchText : "",
    },
    skip: !session || !searchText,
    onCompleted(data) {
      if (data.querySearchPosts) {
        // Update searchResults based on received data
        setSearchResults(data.querySearchPosts);
      }
    },
    onError: (error) => {
      toast.error(`Error loading post by search: ${error}`);
      console.error("Error in querySearchPosts func", error);
    },
  });

  // Update loadingStatus based on categories loading state

  useEffect(() => {
    setLoadingStatus(categoriesLoading);
  }, [categoriesLoading]);

  // Update loadingStatus based on user loading state

  useEffect(() => {
    setLoadingStatus(userLoading);
  }, [userLoading]);

  // Update loadingStatus based on userUpdated loading state

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
            setSearchText={setSearchText}
          />
          <main
            className={classNames("main", {
              "writter-active": writterActive,
            })}
          >
            <div className="container main-content flex-row flex-space">
              <Sidebar
                categories={changeView}
                fandoms={categories?.queryCategories}
                setPeriod={setPeriod}
                userSigned={userSigned}
                setBannerActive={setBannerActive}
                setBagReportActive={setBagReportActive}
                loadingStatus={loadingStatus}
              />
              <div
                id="content"
                className={classNames("container", {
                  "full-height full-width flex-row flex-space is-messages":
                    isMessagesRoute,
                })}
              >
                <ContentContext.Provider value={[period, setPeriod]}>
                  <UserContext.Provider
                    value={[userSubscribed, setUserSubscribed]}
                  >
                    {searchText ? (
                      postLoading ? (
                        <div className="posts-container container">
                          <Postloading />
                          <Postloading />
                          <Postloading />
                        </div>
                      ) : (
                        <div className="posts-container container">
                          {searchResults &&
                            searchResults.map(
                              (item: PostPopulated, i: number) => {
                                return (
                                  <Post
                                    session={session}
                                    data={item}
                                    key={`${item}__${i}`}
                                  />
                                );
                              }
                            )}
                        </div>
                      )
                    ) : (
                      children
                    )}
                  </UserContext.Provider>
                </ContentContext.Provider>
              </div>
              {isMessagesRoute ? <MessagesBar session={session} /> : <Reels />}
            </div>
          </main>
        </>
      )}
      <Banner
        bannerActive={bannerActive}
        setBannerActive={setBannerActive}
        session={session}
        bagReportActive={bagReportActive}
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
