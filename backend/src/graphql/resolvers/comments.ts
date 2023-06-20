import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import {
  GraphQLContext,
  CommentPopulated,
  CommentInteractionArguments,
  DeleteItemResoponse,
  QueryPostCommentsArgs,
  QueryUserCommentsArgs,
  CreateItemResoponse,
  CommentCreateVariables,
  QueryCommentsByCommentArgs,
} from "../../util/types";

const resolvers = {
  Query: {
    queryComment: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { prisma } = context;
      const { id } = args;

      try {
        const comment = await prisma.comment.findUnique({
          include: commentPopulated,
          where: {
            id: id,
          },
        });

        if (!comment) {
          throw new Error("There is no such a comment");
        }

        return comment;
      } catch (error: any) {
        console.error("queryComment error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryComments: async function (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;

      try {
        const comments = await prisma.comment.findMany({
          include: commentPopulated,
          orderBy: {
            createdAt: "asc",
          },
          take: 4,
        });

        if (!comments) {
          throw new Error("There is no much comments");
        }

        return comments;
      } catch (error: any) {
        console.error("queryComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPostComments: async function (
      _: any,
      args: QueryPostCommentsArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { postId: id, skip, take } = args;

      try {
        const comments = await prisma.comment.findMany({
          include: commentPopulated,
          where: {
            postId: id,
            parent: null,
          },
          orderBy: {
            createdAt: "asc",
          },
          skip,
          take,
        });

        if (!comments) {
          throw new Error("There is no much comments");
        }

        return comments;
      } catch (error: any) {
        console.error("queryPostComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryUserComments: async function (
      _: any,
      args: QueryUserCommentsArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { userId: id, skip, take } = args;

      try {
        const comments = await prisma.comment.findMany({
          include: commentPopulated,
          where: {
            authorId: id,
          },
          orderBy: {
            createdAt: "asc",
          },
          skip,
          take,
        });

        if (!comments) {
          throw new Error("There is no much comments");
        }

        return comments;
      } catch (error: any) {
        console.error("queryUserComments error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryCommentsByComment: async function (
      _: any,
      args: QueryCommentsByCommentArgs,
      context: GraphQLContext
    ): Promise<Array<CommentPopulated>> {
      const { prisma } = context;
      const { commentId: id, skip, take } = args;

      try {
        const comments = await prisma.comment.findMany({
          include: commentPopulated,
          where: {
            parentId: id,
          },
          orderBy: {
            createdAt: "asc",
          },
          skip,
          take,
        });

        if (!comments) {
          throw new Error("There is no much comments");
        }

        return comments;
      } catch (error: any) {
        console.error("queryUserComments error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createComment: async function (
      _: any,
      args: CommentCreateVariables,
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma } = context;

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
            ...(parentId && { parentId }),
          },
          include: commentPopulated,
        });

        if (newComment) {
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

    deleteComment: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id } = args;

      if (!session?.user) {
        throw new Error("Not authorized");
      }

      try {
        /**
         * Create new comment entity
         */
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
        console.error("createComment error", error);
        throw new GraphQLError("Error creating message");
      }
    },

    editComment: async function (
      _: any,
      args: { id: string; text: string },
      context: GraphQLContext
    ): Promise<CommentPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, text } = args;

      if (!session?.user) {
        throw new Error("Not authorized");
      }

      try {
        /**
         * Create new comment entity
         */
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
        console.error("createComment error", error);
        throw new GraphQLError("Error creating message");
      }
    },

    addLikeToComment: async function (
      _: any,
      args: CommentInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: commentId } = args;
      const userId = session.user.id;

      try {
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          throw new Error("Comment is not exist");
        }

        if (comment.likedByUserIDs.includes(userId)) {
          throw new Error("You have already liked this comment.");
        }

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
        throw new GraphQLError("Error to like the comment");
      }
    },

    addDislikeToComment: async function (
      _: any,
      args: CommentInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: commentId } = args;
      const userId = session.user.id;

      try {
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          throw new Error("Comment is not exist");
        }

        if (comment.dislikedByUserIDs.includes(userId)) {
          throw new Error("You have already disliked this comment.");
        }

        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: {
            dislikedByUserIDs: [userId], // заміна на масив [userId]
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
        throw new GraphQLError("Error to dislike the comment");
      }
    },
  },
};

export const commentPopulated = Prisma.validator<Prisma.CommentInclude>()({
  author: {
    select: {
      id: true,
      image: true,
      username: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  parent: {
    select: {
      id: true,
      text: true,
    },
  },
  replies: {
    include: {
      author: true,
      post: true,
      parent: true,
      replies: true,
    },
  },
});

export default resolvers;
