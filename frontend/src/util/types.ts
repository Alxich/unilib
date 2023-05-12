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

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
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
  id: string;
}

export interface PostData {
  posts: Array<PostPopulated>;
}

/**
 * Tags
 */
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
  title: string;
  desc: string;
}

export interface CategoriesVariables {
  id: string;
}

export interface CategoryData {
  categories: Array<CategoryPopulated>;
}