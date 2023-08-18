import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { formatTimeToPost } from "../../../util/functions";
import { PostData, SubscribeCategoryArguments } from "../../../util/types";

import Button from "../_button";

import { toast } from "react-toastify";
import { Session } from "next-auth";

import { useMutation } from "@apollo/client";
import CategoryOperations from "../../../graphql/operations/categories";
import PostsOperations from "../../../graphql/operations/posts";
import { PostInteractionArguments } from "../../../util/types";
import {
  CategoryPopulated,
  PostPopulated,
} from "../../../../../backend/src/util/types";

import ReturnMeContent from "../../../util/functions/returnMeContent";

interface PostPageProps {
  data: PostData;
  session: Session | null;
  postCommentsCount?: number | null;
}

const PostPage: FC<PostPageProps> = ({ data, session, postCommentsCount }) => {
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [postData, setPostData] = useState<PostPopulated>(data.queryPost);

  const {
    id: postID,
    title,
    author,
    category,
    content,
    createdAt,
    dislikes,
    likes,
    tags,
    views,
  } = postData;

  /**
   * Define mutations for adding likes and dislikes to a post
   */

  const [addLikeToPost] = useMutation<
    { addLikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addLikeToPost, {
    onError: (error) => {
      console.error("addLikeToPost error", error);
      toast.error("Error occurred while liking the post");
    },
    onCompleted: (data) => {
      if (data.addLikeToPost) {
        // Update the component's state or trigger a refetch to update the data
        setPostData(data.addLikeToPost);

        toast.success("Post was liked!");
      } else {
        toast.error("Failed to like the post");
      }
    },
  });

  const [addDislikeToPost] = useMutation<
    { addDislikeToPost: PostPopulated },
    PostInteractionArguments
  >(PostsOperations.Mutations.addDislikeToPost, {
    onError: (error) => {
      console.error("addDislikeToPost error", error);
      toast.error("Error occurred while disliking the post");
    },
    onCompleted: (data) => {
      if (data.addDislikeToPost) {
        // Update the component's state or trigger a refetch to update the data
        setPostData(data.addDislikeToPost);

        toast.success("Post was disliked!");
      } else {
        toast.error("Failed to dislike the post");
      }
    },
  });

  // Function to handle liking or disliking a post

  const onPostInteraction = async (type: boolean) => {
    /**
     * If it is true, it means we want to like the post.
     * If it is false, it means to dislike the post.
     */
    try {
      // Check if the user is authenticated
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username } = session.user;

      // Check if the user's username exists
      if (!username) {
        throw new Error("Not authorized user");
      }

      if (type !== false) {
        // Handle liking the post
        const { data, errors } = await addLikeToPost({
          variables: {
            id: postID,
          },
        });

        // Check for errors during liking
        if (!data?.addLikeToPost || errors) {
          throw new Error("Error onLikePost when trying to like");
        }

        // Display success message if liking is successful
        if (!errors) {
          toast.success("Post was liked!");
        }
      } else {
        // Handle disliking the post
        const { data, errors } = await addDislikeToPost({
          variables: {
            id: postID,
          },
        });

        // Check for errors during disliking
        if (!data?.addDislikeToPost || errors) {
          throw new Error("Error addDislikeToPost when trying to dislike");
        }

        // Display success message if disliking is successful
        if (!errors) {
          toast.success("Post was disliked!");
        }
      }
    } catch (error: any) {
      // Catch and log errors
      console.error("onPostInteraction error", error);
      toast.error(error?.message);
    }
  };

  // Subscribe to a category mutation
  const [subscribeToCategory] = useMutation<
    { subscribeToCategory: CategoryPopulated },
    SubscribeCategoryArguments
  >(CategoryOperations.Mutations.subscribeToCategory);

  // Use effect to determine if the user is subscribed to a category
  useEffect(() => {
    // Check if the user is authenticated and the category ID is defined
    if (session && category.id !== undefined && userSubscribed !== true) {
      const subscribedCategoryIDs = category.subscriberIDs;

      // Check if the user's ID is in the list of subscribed IDs
      const isSubscribed = subscribedCategoryIDs.find(
        (item) => item === session.user.id
      );

      // Update the user's subscription status
      setUserSubscribed(isSubscribed ? true : false);
    } else {
      // If the user is not authenticated or the category ID is not defined,
      // reset the subscription status to false
      userSubscribed !== true && setUserSubscribed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const onSubscribeCategory = async () => {
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username, id: userId } = session.user;

      // Check if the user is authorized
      if (!username) {
        throw new Error("Not authorized user");
      }

      // Check if the user is already subscribed to the category
      if (userSubscribed) {
        throw new Error("You have already subscribed!");
      }

      // Prepare the subscription data
      const subscribeData = {
        categoryId: category.id,
        userId,
      };

      // Call the subscribeToCategory mutation
      const { data, errors } = await subscribeToCategory({
        variables: {
          ...subscribeData,
        },
      });

      if (!data?.subscribeToCategory || errors) {
        throw new Error("Error subscribing to the category");
      }

      if (!errors) {
        // Update the UI and state to reflect the subscription
        toast.success("Category was subscribed!");
        setUserSubscribed(true);
      }
    } catch (error: any) {
      console.error("onSubscribeCategory error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="post post-wrapper">
      <div className="user-author">
        <div className="author">
          <Link href={`/author/${author.id}`} className="user-icon">
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
            <div className="name">
              <Link href={`/author/${author.id}`}>
                {author.username ? author.username : "Unknown"}
                {" " + formatTimeToPost(createdAt)}
              </Link>
            </div>
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
          <h3>{title}</h3>
        </div>
        <ReturnMeContent className="text-block" content={content} />
      </div>
      <div className="add-info">
        <div className="lt-side">
          {tags.length && (
            <div className="hashtags">
              {tags.map((item, i) => {
                return (
                  <Link href={`/tag/${item.id}`} key={`${item}__${i}`}>
                    {"#" + item.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="rt-side">
          <div className="counters">
            <div className="views">
              <p>{views} Переглядів</p>
            </div>
            <div className="comments">
              <p>{postCommentsCount} Коментарів</p>
            </div>
          </div>
        </div>
      </div>
      <div className="interactions">
        <div className="lt-side">
          <div className="likes">
            <div
              className="fafont-icon likes"
              onClick={() => onPostInteraction(true)}
            >
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{likes != null ? likes : 0}</p>
            </div>
          </div>
          {/* <div className="dislikes">
            <div
              className="fafont-icon dislike"
              onClick={() => onPostInteraction(false)}
            >
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{ width: "100%", height: "100%", color: "inherit" }}
              />
            </div>
            <div className="counter">
              <p>{dislikes != null ? dislikes : 0}</p>
            </div>
          </div> */}
        </div>
        <div className="rt-side">
          <div className="complain item interactive">
            <p>Поскаржитися</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
