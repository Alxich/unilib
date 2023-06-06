import {
  CategoryPopulated,
  ConversationPopulated,
  MessagePopulated,
  PostPopulated,
  TagPopulated,
} from "../../../backend/src/util/types";

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
  subscribedCategoryIDs: [string];
}

export interface UserArguments {
  id: string;
  username: string;
  subscribedCategoryIDs: [string];
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
  skip: number;
  take: number;
}

export interface PostsTagVariables {
  tagId: string;
  skip: number;
  take: number;
}

export interface PostsCatVariables {
  catId: string;
  skip: number;
  take: number;
}

export interface PostsAuthorVariables {
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

export interface PostsByTagData {
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
  queryCategories: Array<CategoryPopulated>;
}

export interface CategoryDataById {
  id: string;
  banner: string;
  icon: string;
  title: string;
  desc: string;
  subscriberCount: number;
}
