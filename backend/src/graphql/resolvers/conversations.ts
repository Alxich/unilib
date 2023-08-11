import { Prisma } from "@prisma/client";
// import { GraphQLError } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/functions";
import {
  ConversationPopulated,
  ConversationUpdatedSubscriptionData,
  ConversationCreatedSubscriptionPayload,
  ConversationDeletedSubscriptionPayload,
  GraphQLContext,
} from "../../util/types";

const resolvers = {
  Query: {
    conversations: async function getConversations(
      _: any,
      args: Record<string, never>,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const { id } = session.user;

        /**
         * Find all conversations that user is part of
         */
        const conversations = await prisma.conversation.findMany({
          /**
           * Below has been confirmed to be the correct
           * query by the Prisma team. Has been confirmed
           * that there is an issue on their end
           * Issue seems specific to Mongo
           */
          // where: {
          //   participants: {
          //     some: {
          //       userId: {
          //         equals: id,
          //       },
          //     },
          //   },
          // },
          orderBy: {
            createdAt: "asc",
          },
          include: conversationPopulated,
        });

        /**
         * Since above query does not work
         */
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === id)
        );
      } catch (error: any) {
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },
    conversationsCount: async function getConversationsCount(
      _: any,
      args: Record<string, never>,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const { id } = session.user;

        /**
         * Find all conversations that user is part of
         */
        const conversations = await prisma.conversation.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: conversationPopulated,
        });

        /**
         * Since above query does not work
         */
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === id)
        );
      } catch (error: any) {
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },
    conversationById: async function getConversationById(
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<ConversationPopulated> {
      const { session, prisma } = context;
      const { id: conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const { id } = session.user;

        /**
         * Find conversation by id that user is part of
         */
        const conversation = await prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
          include: conversationPopulated,
        });

        if (!conversation) {
          throw new GraphQLError("There is no such conversation");
        }

        /**
         * Since above query does not work
         */
        return conversation;
      } catch (error: any) {
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    // A GraphQL mutation to create a new conversation
    createConversation: async function (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> {
      const { session, prisma, pubsub } = context;
      const { participantIds } = args;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: userId } = session.user;

      try {
        // Create a new Conversation entity with the specified participants
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId, // Set 'hasSeenLatestMessage' based on the user
                })),
              },
            },
          },
          include: conversationPopulated, // Include populated data for the conversation
        });

        // Publish the newly created conversation
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id }; // Return the ID of the created conversation
      } catch (error) {
        console.error("createConversation error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },

    // A GraphQL mutation to mark a conversation as read for a specific user
    markConversationAsRead: async function (
      _: any,
      args: { userId: string; conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> {
      const { userId, conversationId } = args;
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // Update the 'hasSeenLatestMessage' field for the conversation participant
        await prisma.conversationParticipant.updateMany({
          where: {
            userId,
            conversationId,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });

        return true; // Indicate the successful marking as read
      } catch (error: any) {
        console.error("markConversationAsRead error", error);
        throw new GraphQLError(error.message);
      }
    },

    // A GraphQL mutation to delete a conversation and related entities
    deleteConversation: async function (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma, pubsub } = context;
      const { conversationId } = args;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // Delete conversation and its related entities within a transaction
        const [deletedConversation] = await prisma.$transaction([
          prisma.conversation.delete({
            where: {
              id: conversationId,
            },
            include: conversationPopulated,
          }),
          prisma.conversationParticipant.deleteMany({
            where: {
              conversationId,
            },
          }),
          prisma.message.deleteMany({
            where: {
              conversationId,
            },
          }),
        ]);

        // Publish a conversation deleted event to notify subscribers
        pubsub.publish("CONVERSATION_DELETED", {
          conversationDeleted: deletedConversation,
        });

        return true; // Indicate the successful deletion
      } catch (error: any) {
        console.error("deleteConversation error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // A GraphQL mutation to update conversation participants
    updateParticipants: async function (
      _: any,
      args: { conversationId: string; participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma, pubsub } = context;
      const { conversationId, participantIds } = args;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        // Fetch existing participants of the conversation
        const participants = await prisma.conversationParticipant.findMany({
          where: {
            conversationId,
          },
        });

        const existingParticipants = participants.map((p) => p.userId);

        // Determine participants to delete and participants to create
        const participantsToDelete = existingParticipants.filter(
          (id) => !participantIds.includes(id)
        );

        const participantsToCreate = participantIds.filter(
          (id) => !existingParticipants.includes(id)
        );

        // Prepare an array of transaction statements to perform updates atomically
        const transactionStatements = [
          prisma.conversation.update({
            where: {
              id: conversationId,
            },
            data: {
              participants: {
                deleteMany: {
                  userId: {
                    in: participantsToDelete,
                  },
                  conversationId,
                },
              },
            },
            include: conversationPopulated,
          }),
        ];

        if (participantsToCreate.length) {
          transactionStatements.push(
            prisma.conversation.update({
              where: {
                id: conversationId,
              },
              data: {
                participants: {
                  createMany: {
                    data: participantsToCreate.map((id) => ({
                      userId: id,
                      hasSeenLatestMessage: true,
                    })),
                  },
                },
              },
              include: conversationPopulated,
            })
          );
        }

        // Execute the transaction statements
        const [deleteUpdate, addUpdate] = await prisma.$transaction(
          transactionStatements
        );

        // Publish a conversation updated event to notify subscribers
        pubsub.publish("CONVERSATION_UPDATED", {
          conversationUpdated: {
            conversation: addUpdate || deleteUpdate,
            addedUserIds: participantsToCreate,
            removedUserIds: participantsToDelete,
          },
        });

        return true; // Indicate the successful update
      } catch (error: any) {
        console.error("updateParticipants error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Subscription: {
    // Subscription to listen for newly created conversations
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          // Subscribe to the "CONVERSATION_CREATED" channel
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;

          // Check if the user is authorized
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationCreated: { participants },
          } = payload;

          // Use a helper function to determine if the user is a participant of the conversation
          return userIsConversationParticipant(participants, userId);
        }
      ),
    },

    // Subscription to listen for updates to existing conversations
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          // Subscribe to the "CONVERSATION_UPDATED" channel
          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        (
          payload: ConversationUpdatedSubscriptionData,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;

          // Check if the user is authorized
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationUpdated: {
              conversation: { participants },
              addedUserIds,
              removedUserIds,
            },
          } = payload;

          // Check various conditions to determine if the user should receive the subscription
          const userIsParticipant = userIsConversationParticipant(
            participants,
            userId
          );

          const userSentLatestMessage =
            payload.conversationUpdated.conversation.latestMessage?.senderId ===
            userId;

          const userIsBeingRemoved =
            removedUserIds &&
            Boolean(removedUserIds.find((id) => id === userId));

          return (
            (userIsParticipant && !userSentLatestMessage) ||
            userSentLatestMessage ||
            userIsBeingRemoved
          );
        }
      ),
    },

    // Subscription to listen for deleted conversations
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          // Subscribe to the "CONVERSATION_DELETED" channel
          return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;

          // Check if the user is authorized
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationDeleted: { participants },
          } = payload;

          // Use a helper function to determine if the user is a participant of the conversation
          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

// Define the structure of the 'participantPopulated' object
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

// Define the structure of the 'conversationPopulated' object
export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      // Include participant information using the 'participantPopulated' structure
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });


export default resolvers;
