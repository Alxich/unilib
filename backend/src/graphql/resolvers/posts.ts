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
    /**
     * Retrieve posts based on the specified criteria.
     */
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

      // Get the start and end date based on the specified period
      const { startDate, endDate } = getDateQueryRange(period);

      try {
        // Handle the case where period is "follow" and no subscribed categories are provided
        if (
          period === "follow" &&
          (!subscribedCategories || subscribedCategories.length <= 0)
        ) {
          return [];
        }

        // Construct the query based on the provided arguments
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

    /**
     * Retrieve posts based on the specified tag, popular status, and period.
     */
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

      // Get the start and end date based on the specified period
      const { startDate, endDate } = getDateQueryRange(period);

      try {
        // Construct the query based on the provided arguments
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: popular !== true ? { createdAt: "asc" } : { views: "desc" },
          ...(period && {
            where: {
              tagIDs: { equals: tagId },
              ...(popular !== true && {
                createdAt: { gte: startDate, lt: endDate },
              }),
            },
          }),
          skip, // Skip posts in the query (not copy the result)
          take, // Limit the number of posts returned
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Retrieve posts based on the specified category, popular status, and period.
     */
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

      // Get the start and end date based on the specified period
      const { startDate, endDate } = getDateQueryRange(period);

      try {
        // Construct the query based on the provided arguments
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: popular !== true ? { createdAt: "asc" } : { views: "desc" },
          ...(period && {
            where: {
              category: {
                id: catId,
              },
              ...(popular !== true && {
                createdAt: { gte: startDate, lt: endDate },
              }),
            },
          }),
          skip, // Skip posts in the query (not copy the result)
          take, // Limit the number of posts returned
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Retrieve posts based on the specified author, popular status, and period.
     */
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

      // Get the start and end date based on the specified period
      const { startDate, endDate } = getDateQueryRange(period);

      try {
        // Construct the query where clause based on the provided arguments
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

        // Fetch posts based on the constructed query
        const posts = await prisma.post.findMany({
          include: postPopulated,
          orderBy: popular !== true ? { createdAt: "asc" } : { views: "desc" },
          where,
          skip, // Skip posts in the query (not copy the result)
          take, // Limit the number of posts returned
        });

        return posts;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Retrieve a single post by its ID and increment its view count.ated post.
     */
    queryPost: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<PostPopulated> {
      const { prisma } = context;
      const { id } = args;

      try {
        if (!id) {
          throw new GraphQLError("No ID inserted");
        }

        // Query the post by its ID
        const post = await prisma.post.findUnique({
          where: {
            id: id,
          },
          include: postPopulated,
        });

        if (!post) {
          throw new GraphQLError("No such post found (404)");
        }

        // Increment the view count of the post
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

    /**
     * Search for posts based on a provided search text, either in the title or content. results.
     */
    querySearchPosts: async function (
      _: any,
      args: { searchText: string },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { prisma } = context;
      const { searchText } = args;

      try {
        if (!searchText) {
          throw new GraphQLError("Please provide either an ID or searchText");
        }

        // Search for posts matching the provided search text in title or content
        const searchResult = await prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchText } },
              { content: { contains: searchText } },
            ],
          },
          include: postPopulated,
        });

        if (!searchResult) {
          throw new GraphQLError("No matching posts found");
        }

        return searchResult;
      } catch (error: any) {
        console.error("Posts error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    /**
     * Create a new post.sful.
     */
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
        // Create a new post entity
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
        throw new GraphQLError("Error creating post");
      }
    },

    /**
     * Create a new post.sful.
     */
    updatePost: async function (
      _: any,
      args: CreatePostArguments,
      context: GraphQLContext
    ): Promise<PostPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title, content, tagsId } = args;

      try {
        // Create a new post entity
        const newPost = await prisma.post.update({
          where: {
            id,
          },
          data: {
            title,
            content,
            tags: {
              set: [],
            },
          },
          include: {
            ...postPopulated,
          },
        });

        const updatedTagPost = await prisma.post.update({
          where: {
            id,
          },
          data: {
            tags: {
              connect: tagsId.map((tagId) => ({ id: tagId.id })),
            },
          },
          include: {
            ...postPopulated,
          },
        });

        return updatedTagPost;
      } catch (error) {
        console.error("createPost error", error);
        throw new GraphQLError("Error creating post");
      }
    },

    /**
     * Add a like to a post.
     */
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
          throw new Error("Post does not exist");
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
        throw new GraphQLError("Error adding a like to the post");
      }
    },

    /**
     * Add a dislike to a post.
     */
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
          throw new Error("Post does not exist");
        }

        if (post.dislikedByUserIDs.includes(userId)) {
          throw new Error("You have already disliked this post.");
        }

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            dislikedByUserIDs: [userId], // Replace with an array containing userId
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
        throw new GraphQLError("Error adding a dislike to the post");
      }
    },
  },
};

/**
 * Validator for including additional fields when querying a post.
 */
export const postPopulated = Prisma.validator<Prisma.PostInclude>()({
  author: {
    select: {
      id: true,
      username: true,
      image: true,
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
