import { FC } from "react";

interface SidebarItemLoadingProps {}

const SidebarItemLoading: FC<SidebarItemLoadingProps> = (
  props: SidebarItemLoadingProps
) => {
  return (
    <div className={"item container flex-row flex-left loading-component"}>
      <span className="fafont" />
      <span className="title" />
    </div>
  );
};

export default SidebarItemLoading;
