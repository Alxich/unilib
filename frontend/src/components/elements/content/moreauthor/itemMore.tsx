import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Session } from "next-auth";
import { CategoryDataByUser, Followers } from "../../../../util/types";
import Button from "../../_button";

interface ItemProps {
  type: boolean;
  session: Session;
  item: CategoryDataByUser | Followers;
  subscribed: boolean;
  onSubscribe: (type: boolean, id: string) => void;
}

const ItemMore: FC<ItemProps> = ({
  session,
  item,
  subscribed,
  onSubscribe,
  type,
}) => {
  const handleSubscribe = () => {
    type
      ? type && "id" in item && onSubscribe(subscribed, item.id)
      : subscribed != true && onSubscribe(subscribed, session.user.id);

    console.log(subscribed);
  };

  /**
   * If type true its a category
   * or if false its a followers
   */

  return (
    <div className="item">
      <div className="icon">
        {type && "icon" in item ? (
          <Image
            src={item.icon}
            alt={`${item.id}__${item.icon}`}
            height={100}
            width={100}
          />
        ) : (
          type != true &&
          "following" in item &&
          item.following.image && (
            <Image
              src={item.following.image}
              alt={`${item.following.id}__${item.following.image}`}
              height={100}
              width={100}
            />
          )
        )}
      </div>
      <div className="name">
        {type && "id" in item ? (
          <Link href={`/group/${item.id}`}>{item.title}</Link>
        ) : (
          type != true &&
          "following" in item && (
            <Link href={`/group/${item.following.id}`}>
              {item.following.username}
            </Link>
          )
        )}
      </div>
      {type != true ? (
        subscribed != true &&
        "following" in item &&
        item.following.id !== session.user.id && (
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
        )
      ) : (
        <Button small filled onClick={handleSubscribe}>
          <div className="fafont-icon big">
            <FontAwesomeIcon
              icon={subscribed === true ? faXmark : faPlus}
              style={{
                width: "100%",
                height: "100%",
                color: "inherit",
              }}
            />
          </div>
        </Button>
      )}
    </div>
  );
};

export default ItemMore;
