import { FC } from "react";

interface CommentItemLoadingProps {}

const CommentItemLoading: FC<CommentItemLoadingProps> = (
  props: CommentItemLoadingProps
) => {
  return (
    <div className="item loading-component">
      <div className="main-content">
        <div className="user-author">
          <div className="author">
            <span className="user-icon" />

            <div className="author-names">
              <div className="name">
                <span />
              </div>
              <div className="time">
                <span />
              </div>
            </div>
          </div>
        </div>

        <span className="content" />

        <div className="interactions">
          <div className="lt-side">
            <div className="answer">
              <span />
            </div>

            <div className="complain">
              <span />
            </div>

            <div className="answer-count">
              <span />
            </div>
          </div>
          <div className="rt-side">
            <div className="heart">
              <span className="fafont" />
            </div>
            <span className="fafont" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItemLoading;
