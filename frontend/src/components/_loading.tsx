import { FC } from "react";

interface LoadingProps {
  isLoaded: boolean;
}

const Loading: FC<LoadingProps> = ({ isLoaded }: LoadingProps) => {
  return (
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

      <div className="author glitch">
        <p data-name="Created by Alxich">
          <span className="effect" aria-hidden="true">
            Created by Alxich
          </span>
          <span className="main">Created by Alxich</span>
        </p>
      </div>
    </div>
  );
};

export default Loading;
