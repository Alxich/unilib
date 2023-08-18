import { FC, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-toastify";

import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import CommentOperations from "../../graphql/operations/comments";
import { CommentPopulated } from "../../../../backend/src/util/types";
import { CommentsData } from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { CommentItem } from "../../components/admin";

const AdminPageComments: FC<NextPage> = () => {
  const { data: session } = useSession();
  const [hasMore, setHasMore] = useState(true);

  const [comments, setComments] = useState<CommentPopulated[] | undefined>();

  const LoadingCompanents = (
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

  const { data, loading, fetchMore } = useQuery<
    CommentsData,
    { take: Number; skip?: Number }
  >(CommentOperations.Queries.queryComments, {
    variables: {
      take: 5,
    },
    onCompleted(data) {
      setComments(data.queryComments);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const getMoreComment = async () => {
    // Check if there are already existing comments
    if (comments) {
      // Call the fetchMore function to get more comments
      const newComments = await fetchMore({
        variables: {
          skip: comments.length, // Skip the number of existing comments
          take: 1, // Fetch one more post
        },
      });

      // If no new comments were fetched, set hasMore to false
      if (newComments.data.queryComments.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new comments to the existing comments array
      setComments((prevComments) => {
        return prevComments
          ? [...prevComments, ...newComments.data.queryComments]
          : [];
      });
    }

    return [];
  };

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all comments which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
                Hey administrator you can change comment information
              </p>
            </div>
            <div className="header__item">--------</div>
          </div>
          <div className="table-header">
            <div className="header__item">
              <p id="author" className="filter__link filter__link--number">
                Author
              </p>
            </div>
            <div className="header__item">
              <p id="post-title" className="filter__link filter__link--number">
                Post title
              </p>
            </div>
            <div className="header__item">
              <p id="dislikes" className="filter__link filter__link--number">
                Updated At
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
              <p id="content" className="filter__link filter__link--number">
                Content
              </p>
            </div>
            <div className="header__item">
              <p id="edit" className="filter__link filter__link--number">
                Edit
              </p>
            </div>
          </div>
          <div className="table-content">
            {comments && (
              <InfiniteScroll
                dataLength={comments.length}
                next={getMoreComment}
                hasMore={hasMore}
                loader={LoadingCompanents}
                key={comments.map((item) => item.id).join("-")} // Unique key for comments array
                endMessage={
                  <div className="table-row">
                    <p>
                      There is no more comments to be loaded. You already see
                      them all {":)"}
                    </p>
                  </div>
                }
              >
                {loading
                  ? LoadingCompanents
                  : !session
                  ? toast.error("Not authorized")
                  : comments.map((item: CommentPopulated, i: number) => {
                      return (
                        <CommentItem
                          item={item}
                          session={session}
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

export default AdminPageComments;
