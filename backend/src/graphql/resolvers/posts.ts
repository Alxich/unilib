import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreatePostArguments,
  PostPopulated,
  PostInteractionArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";
import { getDateQueryRange } from "../../util/functions";

const resolvers = {
  Query: {
    queryPosts: async function (
      _: any,
      args: {
        period: string;
        popular: boolean;
        skip: number;
        take: number;
        subscribedCategories?: [string];
      },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { popular, period, skip, take, subscribedCategories } = args;

      const { startDate, endDate } = getDateQueryRange(period);

      try {
       
        if (period === "follow") {
          console.log(period);
          if (!subscribedCategories || subscribedCategories.length <= 0) {
            return [];
          }
        }

        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: popular !== true ? { createdAt: "asc" } : { views: "desc" },
          ...(popular !== true &&
            period && {
              where: {
                createdAt: { gte: startDate, lt: endDate },
                ...(subscribedCategories &&
                  subscribedCategories?.length > 0 && {
                    category: {
                      id: {
                        in: subscribedCategories,
                      },
                    },
                  }),
              },
            }),
          skip,
          take,
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPostsByTag: async function (
      _: any,
      args: {
        popular: boolean;
        period: string;
        tagId: string;
        skip: number;
        take: number;
      },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { popular, period, tagId, skip, take } = args;

      const { startDate, endDate } = getDateQueryRange(period);

      try {
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy:
            popular !== true
              ? {
                  createdAt: "asc",
                }
              : {
                  views: "desc",
                },
          ...(popular !== true &&
            period && {
              where: {
                tags: {
                  some: {
                    id: tagId,
                  },
                },
                createdAt: { gte: startDate, lt: endDate },
              },
            }),
          skip, // Skip post to query (not copy the result)
          take, // First 10 posts
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPostsByCat: async function (
      _: any,
      args: {
        popular: boolean;
        period: string;
        catId: string;
        skip: number;
        take: number;
      },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { popular, period, catId, skip, take } = args;

      const { startDate, endDate } = getDateQueryRange(period);

      try {
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy:
            popular !== true
              ? {
                  createdAt: "asc",
                }
              : {
                  views: "desc",
                },
          ...(popular !== true &&
            period && {
              where: {
                category: {
                  id: catId,
                },
                createdAt: { gte: startDate, lt: endDate },
              },
            }),
          skip, // Skip post to query (not copy the result)
          take, // First 10 posts
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryPostsByAuthor: async function (
      _: any,
      args: {
        popular: boolean;
        period: string;
        authorId: string;
        skip: number;
        take: number;
      },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { popular, period, authorId, skip, take } = args;

      const { startDate, endDate } = getDateQueryRange(period);

      try {
        const where = {
          author: {
            id: authorId,
          },
        };

        if (period) {
          Object.assign(where, {
            createdAt: { gte: startDate, lt: endDate },
          });
        }

        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: popular !== true ? { createdAt: "asc" } : { views: "desc" },
          where,
          skip, // Skip post to query (not copy the result)
          take, // First 3 posts
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
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

        return updatedPost;
      } catch (error: any) {
        console.error("Posts error", error);
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

        return true;
      } catch (error) {
        console.error("createPost error", error);
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

        return updatedPost;
      } catch (error) {
        console.error("addLikeToPost error", error);
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

        return updatedPost;
      } catch (error) {
        console.error("addDislikeToPost error", error);
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
      subscriberIDs: true,
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
