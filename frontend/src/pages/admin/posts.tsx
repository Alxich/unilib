import { FC, useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import { toast } from "react-toastify";

import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import PostOperations from "../../graphql/operations/posts";
import { PostPopulated } from "../../../../backend/src/util/types";
import { PostsData, PostsVariables } from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button } from "../../components/elements";
import { CreatePostContext } from "../../components/_content";
import { PostItem } from "../../components/admin";

const AdminPagePosts: FC<NextPage> = () => {
  // Getting user session information
  const { data: session } = useSession();

  // Using the useContext hook to access data from a context
  const [adminWritterActive, setAdminWritterActive] =
    useContext(CreatePostContext);

  // State indicating whether there are more posts to load
  const [hasMore, setHasMore] = useState(true);

  // State for storing the list of posts
  const [posts, setPosts] = useState<PostPopulated[] | undefined>();

  // Component for displaying "Loading" when data is being fetched
  const LoadingComponents = (
    <>
      <div className="table-row">
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
        <div className="table-data">Loading</div>
      </div>
    </>
  );

  // Using the useQuery hook to fetch post data
  const { data, loading, fetchMore } = useQuery<PostsData, PostsVariables>(
    PostOperations.Queries.queryPosts,
    {
      variables: {
        skip: 0,
        take: 3,
      },
      // Completed callback when data loading is finished
      onCompleted(data) {
        setPosts(data.queryPosts);
      },
      // Error handler
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const getMorePost = async () => {
    // Check if there are already existing posts
    if (posts) {
      // Call the fetchMore function to get more posts
      const newPosts = await fetchMore({
        variables: {
          skip: posts.length, // Skip the number of existing posts
          take: 1, // Fetch one more post
        },
      });

      // If no new posts were fetched, set hasMore to false
      if (newPosts.data.queryPosts.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new posts to the existing posts array
      setPosts((prevPosts) => {
        return prevPosts ? [...prevPosts, ...newPosts.data.queryPosts] : [];
      });
    }

    return [];
  };

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all posts which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
                Do you want to create a new post ?
              </p>
            </div>
            <div className="header__item">
              <Button
                filled
                disabled={adminWritterActive}
                className="filter__link"
                onClick={() => {
                  setAdminWritterActive(true);
                }}
              >
                Create new post
              </Button>
            </div>
          </div>
          <div className="table-header">
            <div className="header__item">
              <p id="title" className="filter__link">
                Title
              </p>
            </div>
            <div className="header__item">
              <p id="author" className="filter__link filter__link--number">
                Author
              </p>
            </div>
            <div className="header__item">
              <p id="likes" className="filter__link filter__link--number">
                Likes
              </p>
            </div>
            <div className="header__item">
              <p id="dislikes" className="filter__link filter__link--number">
                Dislikes
              </p>
            </div>
            <div className="header__item">
              <p id="views" className="filter__link filter__link--number">
                Views
              </p>
            </div>
            <div className="header__item">
              <p id="edit" className="filter__link filter__link--number">
                Edit
              </p>
            </div>
          </div>
          <div className="table-content">
            {loading
              ? LoadingComponents
              : !session
              ? toast.error("Not authorized user")
              : posts && (
                  <InfiniteScroll
                    dataLength={posts.length}
                    next={getMorePost}
                    hasMore={hasMore}
                    loader={LoadingComponents}
                    key={posts.map((item) => item.id).join("-")} // Unique key for posts array
                    endMessage={
                      <div className="table-row">
                        <p>
                          There is no more posts to be loaded. You already see
                          them all {":)"}
                        </p>
                      </div>
                    }
                  >
                    {posts.map((item: PostPopulated, i: number) => {
                      return (
                        <PostItem
                          session={session}
                          item={item}
                          key={`${item}__${i}`}
                        />
                      );
                    })}
                  </InfiniteScroll>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPagePosts;
