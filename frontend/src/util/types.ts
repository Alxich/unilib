import { Session } from "next-auth";
import {
  CategoryPopulated,
  CommentPopulated,
  ConversationPopulated,
  MessagePopulated,
  PostPopulated,
  TagPopulated,
} from "../../../backend/src/util/types";

/**
 * Client configuration
 */
export interface DeleteItemResoponse {
  success?: boolean;
  error?: string;
}

/**
 * Users
 */
export interface CreateUsernameVariables {
  username: string;
}

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface SearchUsersInputs {
  username: string;
}

export interface SearchUserVariables {
  id: string;
}

export interface SearchUserData {
  searchUser: SearchedUserById;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

export interface SearchedUserById {
  id: string;
  username: string;
  aboutMe: string;
  image: string;
  banner: string;
  subscribedCategoryIDs: [string];
  followedBy?: Array<Followers>;
}

export interface UserArguments {
  id: string;
  username: string;
  subscribedCategoryIDs: [string];
}

export interface Followers {
  follower: FollowItem;
  following: FollowItem;
}

export interface FollowItem {
  id: string;
  username: string;
  image: string;
}

export interface FollowUserArguments {
  followerId: string;
  followingId: string;
}

/**
 * Messages
 */
export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface SendMessageVariables {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessagesSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}

/**
 * Conversations
 */
export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    };
  };
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: Omit<ConversationPopulated, "latestMessage"> & {
      latestMessage: MessagePopulated;
    };
    addedUserIds: Array<string> | null;
    removedUserIds: Array<string> | null;
  };
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

/**
 * Posts
 */
export interface CreatePostArguments {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  tagId?: string[] | string;
}

export interface PostsVariables {
  popular?: boolean;
  period?: string;
  skip: number;
  take: number;
}

export interface PostsTagVariables {
  popular?: boolean;
  period?: string;
  tagId: string;
  skip: number;
  take: number;
}

export interface PostsCatVariables {
  popular?: boolean;
  period?: string;
  catId: string;
  skip: number;
  take: number;
}

export interface PostsAuthorVariables {
  popular?: boolean;
  period?: string;
  authorId: string;
  skip: number;
  take: number;
}

export interface PostVariables {
  id: string;
}

export interface PostInteractionArguments {
  id: string;
}

export interface PostsData {
  queryPosts: Array<PostPopulated>;
}

export interface PostsByTagsData {
  queryPostsByTag: Array<PostPopulated>;
}

export interface PostsByCatData {
  queryPostsByCat: Array<PostPopulated>;
}

export interface PostsByAuthorData {
  queryPostsByAuthor: Array<PostPopulated>;
}

export interface PostData {
  queryPost: PostPopulated;
}

export interface PostFail {
  title: string;
}

/**
 * Comments
 */
export interface CommentCreateArguments {
  authorId: string;
  postId: string;
  parentId?: string;
  text: string;
}

export interface CommentCreateVariables {
  input: CommentCreateArguments;
}

export interface QueryPostCommentsArgs {
  postId: string;
  take: number;
  skip: number;
}

export interface CommentsByPostData {
  queryPostComments: Array<CommentPopulated>;
}

export interface CommentsData {
  queryComments: Array<CommentPopulated>;
}

export interface CommentsByCommentData {
  queryCommentsByComment: Array<CommentPopulated>;
}

export interface QueryUserCommentsArgs {
  userId: string;
  take: number;
  skip: number;
}

export interface QueryCommentsByCommentArgs {
  commentId: string;
  take: number;
  skip: number;
}

export interface CommentInteractionArguments {
  id: string;
}

export interface CommentEditInteractionArguments {
  id: string;
  text: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    image: string | null;
    username: string | null;
  };
  post: {
    id: string;
    title: string;
  };
  parent: Comment | null;
  parentId: string | null;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  replies: Comment[] | null;
  isDeleted: boolean;
}

export interface CommentItemProps {
  session?: Session | null;
  commentsData: CommentPopulated;
  complainItems: { title: string; text: string }[];
  postId?: string;
}

export interface CommentsSubscriptionData {
  commentSent: CommentPopulated;
  commentsUpdated: CommentPopulated;
}

/**
 * Tags
 */
export interface TagArguments {
  id: string;
  title: string;
}

export interface CreateTagArguments {
  id: string;
  title: string;
}

export interface TagsVariables {
  id: string;
}

export interface TagData {
  queryTag: TagPopulated;
}

export interface TagDataById {}

export interface TagsData {
  tags: Array<TagPopulated>;
}

/**
 * Categories
 */
export interface CreateCategoryArguments {
  id: string;
  banner: string;
  icon: string;
  title: string;
  desc: string;
}

export interface SubscribeCategoryArguments {
  categoryId: string;
  userId: string;
}

export interface CategoriesVariables {
  id: string;
}

export interface CategoryData {
  queryCategory: CategoryPopulated;
}

export interface CategoriesData {
  queryCategoriesByUser: Array<CategoryPopulated>;
}

export interface CategoryDataByUser {
  id: string;
  icon: string;
  title: string;
}

export interface CategoryDataById {
  id: string;
  banner: string;
  icon: string;
  title: string;
  desc: string;
  subscriberCount: number;
}

/**
 * Author-info.tsx types
 */
export interface AuthorInfoTypes {
  id: string;
  banner?: string;
  icon?: string;
  title?: string;
  desc?: string;
  subscriberCount?: number;
  username?: string;
  aboutMe?: string;
  image?: string;
  subscribedCategoryIDs?: [string];
}
