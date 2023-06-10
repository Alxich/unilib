import { FC, useEffect, useState } from "react";
import type { NextPageContext } from "next";
import Head from "next/head";
import classNames from "classnames";
import { Toaster, toast } from "react-hot-toast";

// Importing once next-auth session
import { getSession, useSession } from "next-auth/react";

import { Header, Banner, Sidebar, Reels, WritterPost } from "../components";

import { useQuery } from "@apollo/client";
import CategoriesOperations from "../graphql/operations/categories";
import { CategoriesData } from "../util/types";

interface ContentProps {
  children: any;
}

const Content: FC<ContentProps> = ({ children }: ContentProps) => {
  const [bannerActive, setBannerActive] = useState(false);
  const [writterActive, setWritterActive] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    writterActive
      ? document.body.classList.add("writter-active")
      : document.body.classList.remove("writter-active");
  }, [writterActive]);

  useEffect(() => {
    setBannerActive(session?.user ? false : true);
  }, [session]);

  const { data: categories, loading: categoriesLoading } =
    useQuery<CategoriesData>(CategoriesOperations.Queries.queryCategories, {
      onError: (error) => {
        toast.error(`Error loading categories: ${error}`);
        console.log("Error in queryCategory func", error);
      },
    });

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
              {categoriesLoading ? (
                "loading"
              ) : (
                <Sidebar
                  categories={[]}
                  fandoms={categories?.queryCategories}
                />
              )}
              <div id="content" className="container">
                {children}
              </div>
              <Reels />
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
