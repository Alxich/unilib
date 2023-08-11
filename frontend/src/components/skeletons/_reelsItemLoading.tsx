import { FC } from "react";

interface ReelsItemLoadingProps {}

const ReelsItemLoading: FC<ReelsItemLoadingProps> = (
  props: ReelsItemLoadingProps
) => {
  return (
    <div className="item container flex-left loading-component">
      <div className="author-thread container flex-left flex-row">
        <span className="icon" />

        <div className="info container flex-left">
          <div className="nickname">
            <span />
          </div>
          <div className="thematic">
            <span />
          </div>
        </div>
      </div>
      <span className="text-block" />
    </div>
  );
};

export default ReelsItemLoading;
