import { Session } from "next-auth";
import {
  CategoryPopulated,
  CommentPopulated,
  ConversationPopulated,
  MessagePopulated,
  PostPopulated,
  TagPopulated,
  TagPostCreateArguments,
  UserPopulated,
} from "../../../backend/src/util/types";
import { User } from "@prisma/client";

/**
 * Client configuration
 */

export interface FindItemResoponse {
  success?: boolean;
  error?: string;
}

export interface DeleteItemResoponse {
  success?: boolean;
  error?: string;
}

export interface UpdateItemResoponse {
  success?: boolean;
  error?: string;
}

export interface ContentViewChanger {
  icon: "faFire" | "faClock" | "faNewspaper";
  title: string;
  iconTypeFaFont: boolean;
  link: string;
}

export type ContentViews =
  | "popular"
  | "follow"
  | "today"
  | "week"
  | "month"
  | "year";

/**
 * Users
 */
export interface CreateUsernameVariables {
  username: string;
  wantBeAdmin?: boolean;
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

export interface AdminFindData {
  queryFisrtAdmin: FindItemResoponse;
}

export interface queryUsersData {
  queryUsers: Array<UserPopulated>;
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
  email: string;
  createdAt: Date;
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

export interface UpdateUserArguments {
  username?: string;
  desc?: string;
  image?: string;
  banner?: string;
  password?: string;
}

export interface UpdateUserAdminArguments {
  id: string;
  username?: string;
  desc?: string;
  image?: string;
  banner?: string;
  password?: string;
}

export interface UserSubscriptionData {
  userUpdated: UserPopulated;
}

export interface UserAdminItemProps {
  session: Session;
  item: UserPopulated;
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

export interface ConversationsCountData {
  conversationsCount: Array<ConversationPopulated>;
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

export interface UpdatePostArguments {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  categoryId?: string;
  tagsId: Array<TagPostCreateArguments>;
}

export interface PostsVariables {
  popular?: boolean;
  period?: string;
  skip: number;
  take: number;
  subscribedCategories?: [string];
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

export interface PostsSearchVariables {
  searchText: string;
}

export interface PostInteractionArguments {
  id: string;
}

export interface PostsData {
  queryPosts: Array<PostPopulated>;
}
export interface PostsSearchgData {
  querySearchPosts: Array<PostPopulated>;
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

export interface PostItemProps {
  session: Session;
  item: PostPopulated;
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
  take?: number;
  skip?: number;
}

export interface QueryUserCommentsArgs {
  userId: string;
  take: number;
  skip: number;
}

export interface CommentsByPostData {
  queryPostComments: Array<CommentPopulated>;
}

export interface CommentsByUserData {
  queryUserComments: Array<CommentPopulated>;
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
  take?: number;
  skip?: number;
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
  isUser: boolean;
  subscribeToMoreComments?: (postId: string) => void;
}

export interface CommentsSubscriptionData {
  commentsUpdated: CommentPopulated;
}

export interface CommentsSentSubscriptionData {
  commentsUpdated: CommentPopulated;
}

export interface CommentAdminItemProps {
  session: Session;
  item: CommentPopulated;
}

export type CommentReply = Comment & {
  author: User;
  post: {
    id: string;
    title: string;
  };
  parent: Comment | null;
  replies: Comment[];
};

/**
 * Tags
 */
export interface TagArguments {
  id: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  postIDs?: string[];
  posts?: Array<Object>;
}

export interface CreateTagArguments {
  id: string;
  title: string;
}

export interface UpdateTagArguments {
  id: string;
  title: string;
}

export interface TagItemProps {
  session: Session;
  item: TagArguments;
}

export interface TagsVariables {
  id: string;
}

export interface TagData {
  queryTag: TagPopulated;
}

export interface TagDataById {}

export interface TagsData {
  queryTags: Array<TagPopulated>;
}

/**
 * Categories
 */
export interface CreateCategoryArguments {
  id: string;
  banner?: string;
  icon?: string;
  title: string;
  desc?: string;
}

export interface onCreateCategoryArgs {
  banner: string;
  icon: string;
  title: string;
  desc: string;
}

export interface UpdateCategoryArguments {
  id: string;
  banner?: string;
  icon?: string;
  title?: string;
  desc?: string;
}

export interface CatFormInput {
  id: string;
  title?: string;
  banner?: string;
  desc?: string;
  icon?: string;
}

export interface SubscribeCategoryArguments {
  categoryId: string;
  userId: string;
}

export interface CategoriesVariables {
  id: string;
}

export interface CategoryArguments {
  id: string;
  banner: string;
  icon: string;
  title: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Array<Object>;
}

export interface CategoryData {
  queryCategory: CategoryPopulated;
}

export interface CreateCategoryData {
  createCategory: CategoryPopulated;
}

export interface CategoriesByUserData {
  queryCategoriesByUser: Array<CategoryPopulated>;
}

export interface CategoriesData {
  queryCategories: Array<CategoryPopulated>;
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
  createdAt: Date
}
