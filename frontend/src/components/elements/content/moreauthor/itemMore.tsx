import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import { CategoryDataByUser } from "../../../../util/types";
import Button from "../../_button";

interface ItemProps {
  item: CategoryDataByUser;
  subscribed: boolean;
  onSubscribe: (type: boolean, categoryId: string) => void;
}

const ItemMore: FC<ItemProps> = ({ item, subscribed, onSubscribe }) => {
  const handleSubscribe = () => {
    onSubscribe(subscribed, item.id);
  };

  return (
    <div className="item">
      <div className="icon">
        {item.icon && (
          <Image
            src={item.icon}
            alt={`${item.id}__${item.icon}`}
            height={100}
            width={100}
          />
        )}
      </div>
      <div className="name">
        <Link href={`/group/${item.id}`}>{item.title}</Link>
      </div>
      <Button small filled onClick={handleSubscribe}>
        <div className="fafont-icon big">
          <FontAwesomeIcon
            icon={subscribed !== false ? faPlus : faXmark}
            style={{
              width: "100%",
              height: "100%",
              color: "inherit",
            }}
          />
        </div>
      </Button>
    </div>
  );
};

export default ItemMore;
