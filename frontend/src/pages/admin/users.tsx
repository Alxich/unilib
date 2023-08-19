import { FC, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-toastify";

import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import UserOperations from "../../graphql/operations/users";
import { UserPopulated } from "../../../../backend/src/util/types";
import { queryUsersData } from "../../util/types";
import InfiniteScroll from "react-infinite-scroll-component";

import { UserItem } from "../../components/admin";

const AdminPageUsers: FC<NextPage> = () => {
  // Getting user session information
  const { data: session } = useSession();

  // State for storing the list of users
  const [users, setUsers] = useState<UserPopulated[] | undefined>();

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

  // Using the useQuery hook to fetch user data
  const { data, loading, fetchMore } = useQuery<queryUsersData, UserPopulated>(
    UserOperations.Queries.queryUsers,
    {
      // Completed callback when data loading is finished
      onCompleted(data) {
        setUsers(data.queryUsers);
      },
      // Error handler
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

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
                next={() => {}}
                hasMore={false}
                loader={LoadingComponents}
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
                {loading
                  ? LoadingComponents
                  : !session
                  ? toast.error("Not authorized user")
                  : users.map((item: UserPopulated, i: number) => {
                      return (
                        <UserItem
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

export default AdminPageUsers;
