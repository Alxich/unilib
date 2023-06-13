import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversations";
import { messagePopulated } from "../graphql/resolvers/messages";
import { postPopulated } from "../graphql/resolvers/posts";
import { tagPopulated } from "../graphql/resolvers/tags";
import { categoryPopulated } from "../graphql/resolvers/categories";
import { userPopulated } from "../graphql/resolvers/users";

/**
 * Server Configuration
 */
export interface Session {
  user?: User;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface CreateItemResoponse {
  success?: boolean;
  error?: string;
}

export interface DeleteItemResoponse {
  success?: boolean;
  error?: string;
}

/**
 * Users
 */
export interface User {
  id: string;
  username: string;
}

export interface SearchUsersResponse {
  users: Array<User>;
}

export interface FollowUserResponse {
  followerId: string;
  followingId: string;
}

export type UserPopulated = Prisma.UserGetPayload<{
  include: typeof userPopulated;
}>;

/**
 * Messages
 */
export interface SendMessageArguments {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface SendMessageSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;

/**
 * Conversations
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionData {
  conversationUpdated: {
    conversation: ConversationPopulated;
    addedUserIds: Array<string>;
    removedUserIds: Array<string>;
  };
}

export interface ConversationDeletedSubscriptionPayload {
  conversationDeleted: ConversationPopulated;
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
  tagsId: Array<TagPostCreateArguments>;
}

export interface PostInteractionArguments {
  id: string;
}

export type PostPopulated = Prisma.PostGetPayload<{
  include: typeof postPopulated;
}>;

/**
 * Tags
 */
export interface TagPostCreateArguments {
  id: string;
  title: string;
}
export interface CreateTagArguments {
  id: string;
  title: string;
}

export type TagPopulated = Prisma.TagGetPayload<{
  include: typeof tagPopulated;
}>;

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

export type CategoryPopulated = Prisma.CategoryGetPayload<{
  include: typeof categoryPopulated;
}>;