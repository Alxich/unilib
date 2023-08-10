import { FC } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface FlowItemProps {
  id: string;
  title: string;
  counter: number;
}

const FlowItem: FC<FlowItemProps> = ({ id, title, counter }: FlowItemProps) => {
  return (
    <div className="item">
      <Link className="title" href={`/post/${id}`}>
        {title}
      </Link>
      <Link className="comments" href={`/post/${id}`}>
        <div className="fafont-icon comments">
          <FontAwesomeIcon
            icon={faComments}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
        <div className="counter">
          <p>{counter}</p>
        </div>
      </Link>
    </div>
  );
};

export default FlowItem;
