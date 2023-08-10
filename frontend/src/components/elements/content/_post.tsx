import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { toast } from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../_button";

import { Session } from "next-auth";

import { useMutation } from "@apollo/client";
import CategoryOperations from "../../../graphql/operations/categories";
import PostsOperations from "../../../graphql/operations/posts";
import {
  PostFail,
  PostInteractionArguments,
  SubscribeCategoryArguments,
} from "../../../util/types";
import {
  CategoryPopulated,
  PostPopulated,
} from "../../../../../backend/src/util/types";

import { formatTimeToPost } from "../../../util/functions";
import ReturnMeContent from "../../../util/functions/returnMeContent";

interface PostPageProps {
  session: Session | null;
  data: PostPopulated | PostFail;
  isFailPage?: boolean;
  children?: any | string;
}

const Post: FC<PostPageProps> = ({
  session,
  data,
  isFailPage,
  children,
}: PostPageProps) => {
  const [userSubscribed, setUserSubscribed] = useState<boolean | undefined>(
    undefined
  );

  const [postData, setPostData] = useState<PostPopulated>(
    data as PostPopulated
  );

  // This hook sets up a mutation for adding a like to a post.
  const [addLikeToPost] = useMutation<
    { addLikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addLikeToPost, {
    // This function is executed if an error occurs during the mutation.
    onError: (error) => {
      console.error("addLikeToPost error", error);
      toast.error("An error occurred while liking the post");
    },
    // This function is executed when the mutation is successfully completed.
    onCompleted: (data) => {
      // If data.addLikeToPost is truthy, indicating a successful like.
      if (data.addLikeToPost) {
        // Update the component's state or trigger a refetch to update the data
        // with the newly liked post data.
        setPostData(data.addLikeToPost);

        // Display a success toast message to the user.
        toast.success("Post was liked!");
      } else {
        // If data.addLikeToPost is falsy, indicating a failed like.
        // Display an error toast message to the user.
        toast.error("Failed to like the post");
      }
    },
  });

  // Setup mutation for adding a dislike to a post.
  const [addDislikeToPost] = useMutation<
    { addDislikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addDislikeToPost, {
    // Handle error during the mutation.
    onError: (error) => {
      console.error("addDislikeToPost error", error);
      toast.error("Error disliking the post");
    },
    // Handle successful completion of the mutation.
    onCompleted: (data) => {
      // If a successful dislike.
      if (data.addDislikeToPost) {
        // Update state or trigger refetch for updated data.
        setPostData(data.addDislikeToPost);
        toast.success("Post disliked");
      } else {
        // If dislike failed.
        toast.error("Failed to dislike the post");
      }
    },
  });

  const { id, title, author, category, content, createdAt, likes } =
    postData as PostPopulated;

  /**
   * Handle post interaction (like or dislike) based on the type parameter.
   * If the type is true, the post will be liked; if false, it will be disliked.
   * @param {boolean} type - Whether to like (true) or dislike (false) the post.
   */
  const onPostInteraction = async (type: boolean) => {
    try {
      // Check if the user session is authorized
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if the user exists to ensure post security
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Determine which mutation to use based on the interaction type
      const interactionMutation = type ? addLikeToPost : addDislikeToPost;

      // Perform the selected interaction mutation
      const { data, errors } = await interactionMutation({
        variables: {
          id: id,
        },
      });

      // Handle potential errors during the interaction mutation
      if (!data || errors) {
        const errorMessage = type
          ? "Error liking the post"
          : "Error disliking the post";
        throw new Error(errorMessage);
      }

      // Display a success message based on the interaction type
      const successMessage = type ? "Post was liked!" : "Post was disliked!";
      toast.success(successMessage);
    } catch (error: any) {
      // Handle and display errors
      console.error("onPostInteraction error", error);
      toast.error(error?.message);
    }
  };

  // This hook sets up a mutation for subscribing to a category.
  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.subscribeToCategory);

  // This effect runs when the component mounts or when the 'session' or 'category' changes.
  useEffect(() => {
    // Check if there is an active session and if the category ID is defined.
    // Also, check if the user is not already subscribed to the category.
    if (session && category.id !== undefined && userSubscribed !== true) {
      // Get the array of category IDs that the user is subscribed to.
      const subscribedCategoryIDs = category.subscriberIDs;

      // Check if the current category's ID is in the user's subscribed category IDs.
      const isSubscribed = subscribedCategoryIDs.find(
        (item) => item === session.user.id
      );

      // Set the 'userSubscribed' state based on whether the user is subscribed.
      setUserSubscribed(isSubscribed ? true : false);
    } else {
      // If there is no active session or the category ID is undefined,
      // or the user is already subscribed, set 'userSubscribed' to false.
      setUserSubscribed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // This function handles the action when the user subscribes to a category.
  const onSubscribeCategory = async () => {
    /**
     * When the user clicks the button, we assign or remove them from following the category.
     */

    try {
      // Check if there is an active session.
      if (!session) {
        throw new Error("Not authorized Session");
      }

      // Destructure the username and user ID from the session's user object.
      const { username, id: userId } = session.user;

      // Check if the username exists to ensure a secure operation.
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if the user is already subscribed to the category.
      if (userSubscribed) {
        throw new Error("You have already subscribed!");
      }

      // Prepare the subscription data with the category ID and user ID.
      const subscribeData = {
        categoryId: category.id,
        userId,
      };

      // Execute the 'subscribeToCategory' mutation with the subscription data.
      const { data, errors } = await subscribeToCategory({
        variables: {
          ...subscribeData,
        },
      });

      // If the subscription data or errors exist, handle accordingly.
      if (!data?.subscribeToCategory || errors) {
        throw new Error("Error subscribing to category");
      }

      // If there are no errors, display a success message and set 'userSubscribed' to true.
      if (!errors) {
        toast.success("Category was subscribed!");
        setUserSubscribed(true);
      }
    } catch (error: any) {
      // If any error occurs, log it and display an error toast message.
      console.error("onSubscribeCategory error", error);
      toast.error(error?.message);
    }
  };

  // If it's a fail page, display the appropriate content
  if (isFailPage) {
    // Destructure the 'title' from the 'data' object (assuming data is of type 'PostFail')
    const { title } = data as PostFail;

    return (
      // Apply appropriate CSS classes based on 'isFailPage'
      <div
        className={classNames("post post-wrapper", {
          "fail-page": isFailPage,
        })}
      >
        <div className="content">
          <div className="title">
            {/* Create a link to the '404' page using the 'title' */}
            <Link href={`404`}>
              <h3>{title}</h3>
            </Link>
          </div>
          {/* Render children content */}
          <div className="text-block">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames("post post-wrapper", {
        "fail-page": isFailPage,
      })}
    >
      <div className="user-author">
        <div className="author">
          <Link href={"/group/1"} className="user-icon">
            {author.image && (
              <Image
                src={author.image}
                height={1080}
                width={1920}
                alt="author-background"
              />
            )}
          </Link>
          <div className="author-names">
            <Link href={`/group/${category.id}`} className="group">
              <p>{category.title}</p>
            </Link>
            <Link href={`/author/${author.id}`} className="name">
              {author.username ? author.username : "Unknown"}
              {" " + formatTimeToPost(createdAt)}
            </Link>
          </div>
        </div>
        {userSubscribed !== true && (
          <Button small filled onClick={() => onSubscribeCategory()}>
            Підписатися
          </Button>
        )}
      </div>

      <div className="content">
        <div className="title">
          <Link href={`/post/${id}`}>
            <h3>{title}</h3>
          </Link>
        </div>
        {content !== undefined && (
          <ReturnMeContent
            className="text-block"
            content={content}
            isLink={{ url: `/post/${id}` }}
          />
        )}
      </div>
      <div className="interactions">
        <div className="lt-side">
          <div className="likes">
            <div className="fafont-icon likes">
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ width: "100%", height: "100%", color: "inherit" }}
                onClick={() => onPostInteraction(true)}
              />
            </div>
            <div className="counter">
              <p>{likes != null ? likes : 0}</p>
            </div>
          </div>
          <div className="comments">
            <div className="fafont-icon comments">
              <FontAwesomeIcon
                icon={faComments}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>
                {/**
                 * Must be here a comment count etc
                 */}
                0
              </p>
            </div>
          </div>
        </div>
        <div className="rt-side">
          <div className="fafont-icon dislike interactive">
            <FontAwesomeIcon
              icon={faThumbsDown}
              style={{ width: "100%", height: "100%", color: "inherit" }}
              onClick={() => onPostInteraction(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
