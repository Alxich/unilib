import classNames from "classnames";
import { FC } from "react";

interface AuthorInfoLoadingProps {
  type: "group" | "tag" | "author";
}

const AuthorInfoLoading: FC<AuthorInfoLoadingProps> = ({
  type,
}: AuthorInfoLoadingProps) => (
  <div
    id="author-info"
    className={classNames("container loading-component", {
      tag: type === "tag",
    })}
  >
    {type !== "tag" && <span className="banner" />}
    <div className="info post-wrapper">
      {type !== "tag" && <span className="icon" />}
      <span className="name" />

      <span className="disription" />

      {type !== "tag" && type !== "author" && (
        <>
          <div className="author-counters">
            <span className="item" />
            <span className="item" />
          </div>
        </>
      )}

      <div className="actions">
        <div className="list-of-actions">
          <div className="item">
            <span />
          </div>

          {type !== "author" && (
            <div className="item">
              <span />
            </div>
          )}
          {type === "author" && (
            <div className="item">
              <span />
            </div>
          )}
          {type === "author" && (
            <>
              <div className="item">
                <span />
              </div>
              <div className="item">
                <span />
              </div>
            </>
          )}
        </div>

        <span className="changer" />
      </div>
    </div>
  </div>
);

export default AuthorInfoLoading;
