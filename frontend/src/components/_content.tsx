import { FC } from "react";

interface ContentProps {
  children: any;
}

const Content: FC<ContentProps> = ({ children }: ContentProps) => {
  return (
    <div id="content" className="container">
      {children}
    </div>
  );
};

export default Content;
