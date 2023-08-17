import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";

import { useQuery } from "@apollo/client";
import UserOperations from "../../graphql/operations/users";
import { UserPopulated } from "../../../../backend/src/util/types";
import { queryUsersData } from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button } from "../../components/elements";
import { formatTimeToPost } from "../../util/functions";

const AdminPageUsers: FC<NextPage> = () => {
  const [hasMore, setHasMore] = useState(true);

  const [users, setUsers] = useState<UserPopulated[] | undefined>();

  const { data, loading, fetchMore } = useQuery<queryUsersData, UserPopulated>(
    UserOperations.Queries.queryUsers,
    {
      onCompleted(data) {
        setUsers(data.queryUsers);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const getMoreUser = async () => {
    // Check if there are already existing users
    if (users) {
      // Call the fetchMore function to get more users
      const newUsers = await fetchMore({
        variables: {
          skip: users.length, // Skip the number of existing users
          take: 1, // Fetch one more post
        },
      });

      // If no new users were fetched, set hasMore to false
      if (newUsers.data.queryUsers.length === 0) {
        setHasMore(false);
        return null;
      }

      // Append the new users to the existing users array
      setUsers((prevUsers) => {
        return prevUsers ? [...prevUsers, ...newUsers.data.queryUsers] : [];
      });
    }

    return [];
  };

  console.log(users);

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all users which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
                Hey administrator you can change user information
              </p>
            </div>
            <div className="header__item">--------</div>
          </div>
          <div className="table-header">
            <div className="header__item">
              <p id="title" className="filter__link">
                Username
              </p>
            </div>
            <div className="header__item">
              <p id="author" className="filter__link filter__link--number">
                id
              </p>
            </div>
            <div className="header__item">
              <p id="likes" className="filter__link filter__link--number">
                Created At
              </p>
            </div>
            <div className="header__item">
              <p id="dislikes" className="filter__link filter__link--number">
                Updated At
              </p>
            </div>
            <div className="header__item">
              <p id="views" className="filter__link filter__link--number">
                Category follows count
              </p>
            </div>
            <div className="header__item">
              <p id="edit" className="filter__link filter__link--number">
                Edit
              </p>
            </div>
          </div>
          <div className="table-content">
            {users && (
              <InfiniteScroll
                dataLength={users.length}
                next={getMoreUser}
                hasMore={hasMore}
                loader={
                  <>
                    <div className="table-row">
                      <div className="table-data">Loading</div>
                      <div className="table-data">Loading</div>
                      <div className="table-data">Loading</div>
                      <div className="table-data">Loading</div>
                      <div className="table-data">Loading</div>
                    </div>
                  </>
                }
                key={users.map((item) => item.id).join("-")} // Unique key for users array
                endMessage={
                  <div className="table-row">
                    <p>
                      There is no more users to be loaded. You already see them
                      all {":)"}
                    </p>
                  </div>
                }
              >
                {users.map((item: UserPopulated, i: number) => {
                  return (
                    <div className="table-row" key={`${item}__${i}`}>
                      <div className="table-data">{item.username}</div>
                      <div className="table-data">{item.id}</div>
                      <div className="table-data">
                        {formatTimeToPost(item.createdAt)}
                      </div>
                      <div className="table-data">
                        {formatTimeToPost(item.updatedAt)}
                      </div>
                      <div className="table-data">
                        {item.subscribedCategoryIDs.length}
                      </div>
                      <div className="table-data edit">Edit</div>
                    </div>
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

export default AdminPageUsers;
