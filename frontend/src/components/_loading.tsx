import { FC } from "react";

interface LoadingProps {
  isLoaded: boolean;
  showProject: boolean;
}

const Loading: FC<LoadingProps> = ({ isLoaded, showProject }: LoadingProps) => {
  return showProject ? (
    <div id="loading" className={isLoaded === true ? "loaded" : "is-loading"}>
      <div className="title glitch">
        <h1 className="glitch" data-name="DarkNight Project">
          <span className="effect" aria-hidden="true">
            DarkNight Project
          </span>
          <span className="main">DarkNight Project</span>
        </h1>
        <p className="glitch" data-name="For the Darkness of Dark">
          <span className="effect" aria-hidden="true">
            For the Darkness of Dark
          </span>
          <span className="main">For the Darkness of Dark</span>
        </p>
      </div>
    </div>
  ) : (
    <div
      id="loading"
      className={
        isLoaded === true
          ? "loader-container loaded"
          : "loader-container is-loading"
      }
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
