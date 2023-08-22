import classNames from "classnames";
import { FC } from "react";

interface AuthorInfoLoadingProps {}

const AuthorInfoLoading: FC<AuthorInfoLoadingProps> = (
  props: AuthorInfoLoadingProps
) => {
  const itemAmout = [1, 2, 3, 4];
  const item = () => {
    return (
      <div className="item">
        <span className="icon" />
        <div className="name">
          <span />
        </div>
        <span className="button" />
      </div>
    );
  };
  return (
    <div className="info-item post-wrapper loading-component">
      <div className="title">
        <span />
        <span className="count" />
      </div>
      <div className="list container flex-row flex-stretch flex-wrap flex-space full-width">
        {itemAmout.map(() => item())}
      </div>
      <div className="actions">
        <span />
        <span />
      </div>
    </div>
  );
};

export default AuthorInfoLoading;
