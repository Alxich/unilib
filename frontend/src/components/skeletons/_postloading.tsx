import { FC } from "react";

interface PostloadingProps {}

const Postloading: FC<PostloadingProps> = (props: PostloadingProps) => (
  <div className="post post-wrapper loading-component">
    <div className="user-author">
      <div className="author">
        <span className="user-icon" />
        <div className="author-names">
          <span />
          <span />
        </div>
      </div>
    </div>

    <div className="content">
      <span className="title" />
      <span className="text-block" />
    </div>
    <div className="interactions">
      <div className="lt-side">
        <div className="likes">
          <span className="fafont" />
        </div>
        <div className="comments">
          <span className="fafont" />
        </div>
      </div>
      <div className="rt-side">
        <span className="fafont" />
      </div>
    </div>
  </div>
);

export default Postloading;
