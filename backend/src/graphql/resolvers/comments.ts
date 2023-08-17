import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import {
  GraphQLContext,
  CommentPopulated,
  CommentInteractionArguments,
  QueryPostCommentsArgs,
  QueryUserCommentsArgs,
  CreateItemResoponse,
  CommentCreateVariables,
  QueryCommentsByCommentArgs,
  SendCommentSubscriptionPayload,
} from "../../util/types";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {
    // Define a GraphQL query resolver for fetching a populated comment by its ID
    queryComment: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { prisma } = context;
      const { id } = args;

      try {
        // Query a comment by its ID and include the populated comment data
        const comment = await prisma.comment.findUnique({
          include: commentPopulated, // Including the populated comment data
          where: {
            id: id,
          },
        });

        if (!comment) {
          // Throw an error if the comment doesn't exist
          throw new Error("There is no such a comment");
        }

        // Return the fetched and populated comment
        return comment;
      } catch (error: any) {
        // Log the error and throw a GraphQLError with the error message
        console.error("queryComment error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Query to fetch an array of comments
    queryComments: async function (
      _: any,
      args: { skip: number; take: number },
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { take, skip } = args;

      try {
        // Fetch comments from the database
        const comments = await prisma.comment.findMany({
          include: commentPopulated, // Include related data using commentPopulated
          where: {
            isDeleted: false, // Only fetch comments that are not deleted
          },
          orderBy: {
            createdAt: "desc", // Order comments by createdAt in descending order
          },
          ...(skip && { skip }), // If skip is provided, apply skipping
          ...(take && { take }), // If take is provided, apply taking (limit)
        });

        if (!comments) {
          throw new Error("There are no comments available");
        }

        return comments;
      } catch (error: any) {
        console.error("queryComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Query to fetch an array of comments for a specific post
    queryPostComments: async function (
      _: any,
      args: QueryPostCommentsArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { postId: id, skip, take } = args;

      try {
        // Fetch comments from the database for a specific post
        const comments = await prisma.comment.findMany({
          include: commentPopulated, // Include related data using commentPopulated
          where: {
            postId: id, // Fetch comments only for the specified post
            parent: null, // Fetch only top-level comments (not replies to other comments)
          },
          orderBy: {
            createdAt: "asc", // Order comments by createdAt in ascending order
          },
          ...(skip && { skip }), // If skip is provided, apply skipping
          ...(take && { take }), // If take is provided, apply taking (limit)
        });

        if (!comments) {
          throw new Error("There are no comments available");
        }

        return comments;
      } catch (error: any) {
        console.error("queryPostComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Query to fetch an array of comments authored by a specific user
    queryUserComments: async function (
      _: any,
      args: QueryUserCommentsArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { userId: id, skip, take } = args;

      try {
        // Fetch comments from the database authored by the specified user
        const comments = await prisma.comment.findMany({
          include: commentPopulated, // Include related data using commentPopulated
          where: {
            authorId: id, // Fetch comments only authored by the specified user
          },
          orderBy: {
            createdAt: "asc", // Order comments by createdAt in ascending order
          },
          ...(skip && { skip }), // If skip is provided, apply skipping
          ...(take && { take }), // If take is provided, apply taking (limit)
        });

        if (!comments) {
          throw new Error("There are no comments available");
        }

        return comments;
      } catch (error: any) {
        console.error("queryUserComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Query to fetch an array of comments that are replies to a specific comment
    queryCommentsByComment: async function (
      _: any,
      args: QueryCommentsByCommentArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { commentId: id, skip, take } = args;

      try {
        // Fetch comments from the database that are replies to the specified comment
        const comments = await prisma.comment.findMany({
          include: commentPopulated, // Include related data using commentPopulated
          where: {
            parentId: id, // Fetch comments that have the specified comment as parent
          },
          orderBy: {
            createdAt: "asc", // Order comments by createdAt in ascending order
          },
          ...(skip && { skip }), // If skip is provided, apply skipping
          ...(take && { take }), // If take is provided, apply taking (limit)
        });

        if (!comments) {
          throw new Error("There are no comments available");
        }

        return comments;
      } catch (error: any) {
        console.error("queryCommentsByComment error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    // Mutation to create a new comment
    createComment: async function (
      _: any,
      args: CommentCreateVariables,
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma, pubsub } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { authorId, postId, text, parentId } = args.input;

      try {
        /**
         * Create new comment entity
         */
        const newComment = await prisma.comment.create({
          data: {
            authorId,
            postId,
            text,
            ...(parentId && { parentId }), // Include parentId if provided
          },
          include: commentPopulated, // Include related data using commentPopulated
        });

        if (newComment) {
          // Publish the new comment to the corresponding postId channel
          pubsub.publish("COMMENT_SENT", {
            commentSent: newComment,
          });

          // Publish the new comment to the сommentsUpdated channel
          pubsub.publish("ALL_COMMENTS_SENT", {
            commentsUpdated: newComment,
          });

          return {
            success: true,
          };
        } else {
          return {
            error: "Something went wrong",
          };
        }
      } catch (error) {
        console.error("createComment error", error);
        throw new GraphQLError("Error creating message");
      }
    },

    // Mutation to delete a comment
    deleteComment: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id } = args;

      try {
        // Update the specified comment's text and isDeleted status
        const comment = await prisma.comment.update({
          where: {
            id: id,
          },
          data: {
            text: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Хіба ти забув про золоте правило Інтернету? Видаляючи свій коментар, автор залишає нас всіх у незнанні і збудженні, мовчазно кажучи: \\""},{"type":"text","marks":[{"type":"italic"}],"text":"Та якесь смішне було, але тепер це моє маленьке таємницею"},{"type":"text","text":"\\". "},{"type":"text","marks":[{"type":"bold"}],"text":"Ох, цей автор, такий загадковий"},{"type":"text","text":"!"}]}]}',
            isDeleted: true,
          },
          include: {
            ...commentPopulated,
          },
        });

        if (comment) {
          return comment;
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        console.error("deleteComment error", error);
        throw new GraphQLError("Error deleting comment");
      }
    },

    // Mutation to edit a comment
    editComment: async function (
      _: any,
      args: { id: string; text: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, text } = args;

      try {
        // Update the specified comment's text
        const comment = await prisma.comment.update({
          where: {
            id: id,
          },
          data: {
            text: text,
          },
          include: {
            ...commentPopulated,
          },
        });

        if (comment) {
          return comment;
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        console.error("editComment error", error);
        throw new GraphQLError("Error editing comment");
      }
    },

    // Mutation to add a like to a comment
    addLikeToComment: async function (
      _: any,
      args: CommentInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: commentId } = args;
      const userId = session.user.id;

      try {
        // Find the specified comment
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          throw new Error("Comment does not exist");
        }

        // Check if the user has already liked the comment
        if (comment.likedByUserIDs.includes(userId)) {
          throw new Error("You have already liked this comment.");
        }

        // Update the comment with the new like
        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: {
            likedByUserIDs: [userId],
            dislikedByUserIDs: {
              set: comment.dislikedByUserIDs.filter((id) => id !== userId),
            },
            likes: { set: comment.likes != null ? comment.likes + 1 : 0 },
            dislikes: {
              set:
                comment.dislikes != null
                  ? comment.dislikes != 0
                    ? comment.dislikes - 1
                    : 0
                  : 0,
            },
          },
          include: commentPopulated,
        });

        return updatedComment;
      } catch (error) {
        console.error("addLikeToComment error", error);
        throw new GraphQLError("Error while trying to like the comment");
      }
    },

    // Mutation to add a dislike to a comment
    addDislikeToComment: async function (
      _: any,
      args: CommentInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: commentId } = args;
      const userId = session.user.id;

      try {
        // Find the specified comment
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          throw new Error("Comment does not exist");
        }

        // Check if the user has already disliked the comment
        if (comment.dislikedByUserIDs.includes(userId)) {
          throw new Error("You have already disliked this comment.");
        }

        // Update the comment with the new dislike
        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: {
            dislikedByUserIDs: [userId], // Replace with an array containing userId
            likedByUserIDs: {
              set: comment.likedByUserIDs.filter((id) => id !== userId),
            },
            dislikes: {
              set: comment.dislikes != null ? comment.dislikes + 1 : 0,
            },
            likes: {
              set:
                comment.likes != null
                  ? comment.likes != 0
                    ? comment.likes - 1
                    : 0
                  : 0,
            },
          },
          include: commentPopulated,
        });

        return updatedComment;
      } catch (error) {
        console.error("addDislikeToComment error", error);
        throw new GraphQLError("Error while trying to dislike the comment");
      }
    },
  },
  Subscription: {
    // Subscription for a newly sent comment
    commentSent: {
      // Use the withFilter function to filter subscriptions based on arguments
      subscribe: withFilter(
        // Subscribe to the COMMENT_SENT channel
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator("COMMENT_SENT");
        },
        // Define a filter function that checks if the postId matches
        (
          payload: SendCommentSubscriptionPayload,
          args: { postId: string },
          context: GraphQLContext
        ): boolean => {
          return payload.commentSent.postId === args.postId;
        }
      ),
      // Resolve the subscription payload
      resolve: (payload: {
        commentSent: CommentPopulated;
      }): CommentPopulated => {
        return payload.commentSent;
      },
    },

    // Subscription for updated comments
    commentsUpdated: {
      // Subscribe to the ALL_COMMENTS_SENT channel
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;

        return pubsub.asyncIterator("ALL_COMMENTS_SENT");
      },
    },
  },
};

// Definition of the commentPopulated object using Prisma's validator
export const commentPopulated = Prisma.validator<Prisma.CommentInclude>()({
  // Select properties of the author
  author: {
    select: {
      id: true,
      image: true,
      username: true,
    },
  },
  // Select properties of the associated post
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  // Select properties of the parent comment, if exists
  parent: {
    select: {
      id: true,
      text: true,
    },
  },
  // Include properties of the replies and their nested properties
  replies: {
    include: {
      author: true, // Author of the reply
      post: {
        select: {
          id: true,
          title: true,
        },
      }, // Associated post of the reply
      parent: true, // Parent comment of the reply
      replies: true, // Replies to the reply
    },
  },
});

export default resolvers;
