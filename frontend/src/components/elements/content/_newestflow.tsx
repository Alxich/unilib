import { FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faComments } from "@fortawesome/free-solid-svg-icons";

interface FlowItemProps {
  title: string;
  counter: number;
}

const FlowItem: FC<FlowItemProps> = ({ title, counter }: FlowItemProps) => {
  return (
    <div className="item">
      <p className="title">{title}</p>
      <div className="comments">
        <div className="fafont-icon comments">
          <FontAwesomeIcon
            icon={faComments}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
        <div className="counter">
          <p>{counter}</p>
        </div>
      </div>
    </div>
  );
};

interface NewestFlowProps {
  title: string;
  counter: number;
}

const NewestFlow: FC = () => {
  const [openMore, setOpenMore] = useState(false);

  const flowItems: NewestFlowProps[] = [
    {
      title:
        "Джеремі Реннер переніс першу операцію після нещасного випадку під час розчищення снігу",
      counter: 256,
    },
    {
      title:
        "Джеремі Реннер переніс першу операцію після нещасного випадку під час розчищення снігу",
      counter: 256,
    },
    {
      title:
        "Джеремі Реннер переніс першу операцію після нещасного випадку під час розчищення снігу",
      counter: 256,
    },
    {
      title:
        "Джеремі Реннер переніс першу операцію після нещасного випадку під час розчищення снігу",
      counter: 256,
    },
  ];

  return (
    <div id="newestflow" className="container post-wrapper">
      <div className="container flex-start">
        {flowItems.map((item, i) => (
          <FlowItem
            key={`${item}__${i}`}
            title={item.title}
            counter={item.counter}
          />
        ))}
      </div>
      <div className="open-more">
        <p onClick={() => setOpenMore(openMore ? false : true)}>Показати ще</p>
        <div
          className="fafont-icon arrow-down"
          onClick={() => setOpenMore(openMore ? false : true)}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewestFlow;
