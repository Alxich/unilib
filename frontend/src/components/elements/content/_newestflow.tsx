import { FC, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

import { useQuery } from "@apollo/client";
import { PostsByTagsData, PostsTagVariables } from "../../../util/types";
import PostOperations from "../../../graphql/operations/posts";
import FlowItem from "./newesflow/_flowIiem";

const NewestFlow: FC = () => {
  const lengthBeforeArray = 3; // Plus 1 because of 0
  const [openMore, setOpenMore] = useState(false);

  // Query the data for flow items using useQuery hook
  const {
    data: flowItems, // Retrieved data
    loading, // Loading status
    error, // Error information
  } = useQuery<PostsByTagsData, PostsTagVariables>(
    PostOperations.Queries.queryPostsByTag, // Query name
    {
      variables: {
        period: "week", // Set the time period for filtering
        popular: false, // Set the 'popular' variable based on the selected period
        tagId: "64b993322db7ecc9ab2b8663", // The ID of the tag to filter by
        skip: 0, // Number of items to skip
        take: 15, // Number of items to fetch
      },
      // Handle errors during the query
      onError: ({ message }) => {
        // Display an error toast with the error message
        toast.error(message);
      },
    }
  );

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
