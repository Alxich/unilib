import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreatePostArguments,
  PostPopulated,
  PostInteractionArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    queryPosts: async function (
      _: any,
      args: { skip: number; take: number },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { skip, take } = args;

      try {
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: {
            createdAt: "desc",
          },
          skip, // Skip post to query (not copy the result)
          take, // First 10 posts
        });
        
        return posts;
      } catch (error: any) {
        console.log("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPostsByTag: async function (
      _: any,
      args: { tagId: string; skip: number; take: number },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { tagId, skip, take } = args;

      try {
        const posts = await prisma.post.findMany({
          include: postPopulated,
          where: {
            tags: {
              some: {
                id: tagId,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip, // Skip post to query (not copy the result)
          take, // First 10 posts
        });

        return posts;
      } catch (error: any) {
        console.log("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPost: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<PostPopulated> {
      const { prisma } = context;
      const { id } = args;

      try {
        if (!id) {
          throw new GraphQLError("Not id inserted");
        }

        /**
         * Query post by its id
         */
        const post = await prisma.post.findUnique({
          where: {
            id: id,
          },
          include: postPopulated,
        });

        if (!post) {
          throw new GraphQLError("No such a post 404");
        }

        // Increment the viewsCount property
        const updatedPost = await prisma.post.update({
          where: { id },
          data: { views: post.views + 1 },
          include: postPopulated,
        });

        console.log(post);

        return updatedPost;
      } catch (error: any) {
        console.log("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createPost: async function (
      _: any,
      args: CreatePostArguments,
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title, content, authorId, categoryId, tagsId } = args;

      try {
        /**
         * Create new post entity
         */
        const newPost = await prisma.post.create({
          data: {
            id,
            title,
            content,
            authorId,
            categoryId,
            tags: {
              connect: tagsId.map((tagId) => ({ id: tagId.id })),
            },
          },
          include: {
            ...postPopulated,
          },
        });

        console.log(newPost);

        return true;
      } catch (error) {
        console.log("createPost error", error);
        throw new GraphQLError("Error creating message");
      }
    },

    addLikeToPost: async function (
      _: any,
      args: PostInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: postId } = args;
      const userId = session.user.id;

      try {
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
          throw new Error("Post is not exist");
        }

        if (post.likedByUserIDs.includes(userId)) {
          throw new Error("You have already liked this post.");
        }

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            likedByUserIDs: [userId],
            dislikedByUserIDs: {
              set: post.dislikedByUserIDs.filter((id) => id !== userId),
            },
            likes: { set: post.likes != null ? post.likes + 1 : 0 },
            dislikes: {
              set:
                post.dislikes != null
                  ? post.dislikes != 0
                    ? post.dislikes - 1
                    : 0
                  : 0,
            },
          },
          include: postPopulated,
        });

        console.log(updatedPost);

        return updatedPost;
      } catch (error) {
        console.log("addLikeToPost error", error);
        throw new GraphQLError("Error to like the post");
      }
    },

    addDislikeToPost: async function (
      _: any,
      args: PostInteractionArguments,
      context: GraphQLContext
    ) {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: postId } = args;
      const userId = session.user.id;

      try {
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
          throw new Error("Post is not exist");
        }

        if (post.dislikedByUserIDs.includes(userId)) {
          throw new Error("You have already disliked this post.");
        }

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            dislikedByUserIDs: [userId], // заміна на масив [userId]
            likedByUserIDs: {
              set: post.likedByUserIDs.filter((id) => id !== userId),
            },
            dislikes: { set: post.dislikes != null ? post.dislikes + 1 : 0 },
            likes: {
              set:
                post.likes != null ? (post.likes != 0 ? post.likes - 1 : 0) : 0,
            },
          },
          include: postPopulated,
        });

        console.log(updatedPost);

        return updatedPost;
      } catch (error) {
        console.log("addDislikeToPost error", error);
        throw new GraphQLError("Error to dislike the post");
      }
    },
  },
};

export const postPopulated = Prisma.validator<Prisma.PostInclude>()({
  author: {
    select: {
      id: true,
      username: true,
    },
  },
  category: {
    select: {
      id: true,
      title: true,
    },
  },
  tags: {
    select: {
      id: true,
      title: true,
    },
  },
});

export default resolvers;
