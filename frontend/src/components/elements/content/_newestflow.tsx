import { FC, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

import { useQuery } from "@apollo/client";
import { PostsByTagsData, PostsTagVariables } from "../../../util/types";
import PostOperations from "../../../graphql/operations/posts";

import { toast } from "react-hot-toast";

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

const NewestFlow: FC = () => {
  const lengthBeforeArray = 3; // Plus 1 because of 0
  const [openMore, setOpenMore] = useState(false);

  const {
    data: flowItems,
    loading,
    error,
  } = useQuery<PostsByTagsData, PostsTagVariables>(
    PostOperations.Queries.queryPostsByTag,
    {
      variables: {
        period: "week",
        popular: false, // Set the popular variable based on the selected period
        tagId: "64b993322db7ecc9ab2b8663",
        skip: 0,
        take: 15,
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  console.log(flowItems && flowItems.queryPostsByTag);

  return loading ? (
    <></>
  ) : flowItems && flowItems?.queryPostsByTag.length > 0 ? (
    <div id="newestflow" className="container post-wrapper">
      <div className="container flex-start">
        {flowItems.queryPostsByTag.map((item, i) =>
          openMore ? (
            <FlowItem
              key={`${item}__${i}`}
              id={item.id}
              title={item.title}
              counter={0}
            />
          ) : (
            i <= lengthBeforeArray && (
              <FlowItem
                key={`${item}__${i}`}
                id={item.id}
                title={item.title}
                counter={0}
              />
            )
          )
        )}
      </div>
      {flowItems.queryPostsByTag.length > 5 && (
        <div className="open-more">
          <p onClick={() => setOpenMore(openMore ? false : true)}>
            Показати ще
          </p>
          <div
            className="fafont-icon arrow-down"
            onClick={() => setOpenMore(openMore ? false : true)}
          >
            {openMore ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            )}
          </div>
          {openMore && (
            <Link href={`/tag/64b993322db7ecc9ab2b8663`}>Показати усі</Link>
          )}
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default NewestFlow;
