import { FC, useEffect } from "react";
import type { NextPage } from "next";

import { Button } from "../../components/elements";
import Link from "next/link";

const AdminPage: FC<NextPage> = () => {

  return (
    <div id="admin-panel-wrapper">
      <div className="container full-width">
        <div className="title container full-width flex-left flex-top">
          <h2>There is all items which are available to work</h2>
        </div>
        <div className="table">
          <div className="table-header create">
            <div className="header__item">
              <p id="title" className="filter__text">
               Hey administrator is a homepage
              </p>
            </div>
            <div className="header__item">
                --------
            </div>
          </div>
          <div className="table-header">
            <div className="header__item">
              <p id="title" className="filter__link">
                Name
              </p>
            </div>

            <div className="header__item">
              <p id="edit" className="filter__link filter__link--number">
                Action
              </p>
            </div>
          </div>
          <div className="table-content no-edits">
            <div className="table-row">
              <div className="table-data">Posts</div>
              <div className="table-data action">
                <span>
                  <Link href="/admin/posts">Show All </Link>
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-data">Tags</div>
              <div className="table-data action">
                {" "}
                <span>
                  <Link href="/admin/tags">Show All </Link>{" "}
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-data">Categories</div>
              <div className="table-data action">
                {" "}
                <span>
                  <Link href="/admin/categories">Show All </Link>
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-data">Comments</div>
              <div className="table-data action">
                <span>
                  <Link href="/admin/comments">Show All </Link>
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-data">Users</div>
              <div className="table-data action">
                <span>
                  <Link href="/admin/users">Show All </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
