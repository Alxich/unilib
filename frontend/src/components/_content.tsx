import {
  FC,
  SetStateAction,
  createContext,
  useEffect,
  useState,
  Dispatch,
} from "react";
import type { NextPageContext } from "next";
import Head from "next/head";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import {
  Header,
  Banner,
  Sidebar,
  Reels,
  WritterPost,
  MessagesBar,
  Post,
  Loading,
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

import { AdminHeader } from "./admin";

interface ContentProps {
  children: any;
}

type ContentContextValue = [
  ContentViews,
  Dispatch<SetStateAction<ContentViews>>
];

export const ContentContext = createContext<ContentContextValue>([
  "popular",
  () => {},
]);

export const UserContext = createContext<
  [string[] | undefined, Dispatch<SetStateAction<string[] | undefined>>]
>([[], () => {}]);

export const CreatePostContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}]);

const Content: FC<ContentProps> = ({ children }: ContentProps) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bannerActive, setBannerActive] = useState(false);
  const [writterAdminActive, setWritterAdminActive] = useState<boolean>(false);
  const [writterActive, setWritterActive] = useState(false);
  const [userSigned, setUserSigned] = useState(false);
  const [bagReportActive, setBagReportActive] = useState(false);
  const [period, setPeriod] = useState<ContentViews>("popular");
  const [userSubscribed, setUserSubscribed] = useState<string[] | undefined>();

  const { data: session, status } = useSession();

  // Initialize Next.js router and check if the current route is related to messages

  const router = useRouter();
  const isMessagesRoute = router.pathname.startsWith("/messages");
  const isAdminRoute = router.pathname.startsWith("/admin");

  // Check if user is admin if not we cant show him admin page

  useEffect(() => {
    if (isAdminRoute && status !== "loading") {
      session?.user.isAdmin !== true && router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Apply CSS class based on writterActive state

  useEffect(() => {
    writterActive
      ? document.body.classList.add("writter-active")
      : document.body.classList.remove("writter-active");
  }, [writterActive]);

  // Apply CSS class based on isAdminRoute state

  useEffect(() => {
    if (isAdminRoute) {
      // '0' to assign the first (and only `HTML` tag)
      const root = document.getElementsByTagName("html")[0];

      root.classList.add("white-themed");
      root.classList.remove("black-themed");
    }
  }, [isAdminRoute]);

  // Set bannerActive based on user session

  useEffect(() => {
    status !== "loading" && setBannerActive(session?.user ? false : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Show loading component while fetching user

  useEffect(() => {
    setIsLoaded(status !== "loading");
  }, [status]);

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
      <Loading isLoaded={isLoaded} showProject={false} />
      {session && (
        <>
          {isAdminRoute ? (
            <AdminHeader />
          ) : (
            <Header
              setBannerActive={setBannerActive}
              session={session}
              writterActive={writterActive}
              setWritterActive={setWritterActive}
              setSearchText={setSearchText}
            />
          )}
          <main
            className={classNames("main", {
              "writter-active": writterActive,
              loading: !isLoaded,
            })}
          >
            <div className="container main-content flex-row flex-space flex-top">
              {!isAdminRoute && (
                <Sidebar
                  categories={changeView}
                  fandoms={categories?.queryCategories}
                  setPeriod={setPeriod}
                  userSigned={userSigned}
                  setBannerActive={setBannerActive}
                  setBagReportActive={setBagReportActive}
                  loadingStatus={loadingStatus}
                />
              )}
              <div
                id="content"
                className={classNames("container", {
                  "full-height full-width flex-row flex-space is-messages":
                    isMessagesRoute,
                  "full-height full-width flex-row flex-space is-admin":
                    isAdminRoute,
                })}
              >
                <ContentContext.Provider value={[period, setPeriod]}>
                  <UserContext.Provider
                    value={[userSubscribed, setUserSubscribed]}
                  >
                    <CreatePostContext.Provider
                      value={[writterAdminActive, setWritterAdminActive]}
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
                    </CreatePostContext.Provider>
                  </UserContext.Provider>
                </ContentContext.Provider>
              </div>
              {!isAdminRoute && isMessagesRoute ? (
                <MessagesBar session={session} />
              ) : (
                !isAdminRoute && <Reels />
              )}
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
          writterActive={writterActive || writterAdminActive}
          setWritterActive={setWritterActive}
          writterAdminActive={writterAdminActive}
          setWritterAdminActive={setWritterAdminActive}
        />
      )}

      <footer className={"colophon"}></footer>
      <div>
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          theme={"dark"}
          style={{
            display: "none",
          }}
        />
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
