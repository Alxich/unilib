import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateCategoryArguments,
  CategoryPopulated,
  SubscribeCategoryArguments,
  UpdateCategoryArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    // Fetch a single category by its ID
    queryCategory: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { prisma } = context;
      const { id: catID } = args;

      try {
        // Use Prisma to find a unique category with the specified ID
        const category = await prisma.category.findUnique({
          where: {
            id: catID,
          },
          include: categoryPopulated, // Include related data as defined in include options
        });

        if (!category) {
          throw new Error("Category does not exist");
        }

        return category;
      } catch (error: any) {
        console.error("Categories error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Fetch all categories
    queryCategories: async function (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<CategoryPopulated>> {
      const { prisma } = context;

      try {
        // Use Prisma to find all categories, including related data
        const categories = await prisma.category.findMany({
          include: categoryPopulated, // Include related data as defined in include options
          orderBy: {
            createdAt: "desc", // Order by createdAt in descending order
          },
        });

        if (!categories) {
          throw new Error("Categories do not exist");
        }

        return categories;
      } catch (error: any) {
        console.error("Categories error", error);
        throw new GraphQLError(error?.message);
      }
    },

    // Fetch categories subscribed by a user
    queryCategoriesByUser: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Array<CategoryPopulated>> {
      const { prisma } = context;
      const { id } = args;

      try {
        // Use Prisma to find categories where the user is a subscriber
        const categories = await prisma.category.findMany({
          where: {
            subscribers: {
              some: {
                id: id,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: categoryPopulated,
        });

        if (!categories) {
          throw new Error("Categories do not exist");
        }

        return categories;
      } catch (error: any) {
        console.error("Categories error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    // Create a new category
    createCategory: async function (
      _: any,
      args: CreateCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma } = context;

      // Check if the user is authenticated
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title, desc, banner, icon } = args;

      try {
        // Create a new category entity using Prisma's create method
        const newCategory = await prisma.category.create({
          data: {
            id,
            title,
            desc,
            banner,
            icon,
          },
          include: categoryPopulated, // Include related data as defined in include options
        });

        if (!newCategory) {
          throw new Error("Category was not created");
        }

        return newCategory; // Return true if the category creation is successful
      } catch (error) {
        console.error("createCategory error", error);
        throw new GraphQLError("Error creating category");
      }
    },

    // Update a current category
    updateCategory: async function (
      _: any,
      args: UpdateCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma } = context;

      // Check if the user is authenticated
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title, desc, banner, icon } = args;

      if (!id) {
        throw new GraphQLError("Not specifed which category to update");
      }

      try {
        // Update a new category entity using Prisma's update method
        const newCategory = await prisma.category.update({
          where: {
            id,
          },
          data: {
            ...(title && { title }),
            ...(desc && { desc }),
            ...(banner && { banner }),
            ...(icon && { icon }),
          },
          include: categoryPopulated, // Include related data as defined in include options
        });

        if (!newCategory) {
          throw new Error("Category was not updated");
        }

        return newCategory; // Return Object if the category creation is successful
      } catch (error) {
        console.error("updateCategory error", error);
        throw new GraphQLError("Error creating category");
      }
    },

    // Subscribe a user to a category
    subscribeToCategory: async function (
      _: any,
      args: SubscribeCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma, pubsub } = context;

      // Check if the user is authenticated
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { categoryId, userId } = args;

      try {
        // Find the category by its ID
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new Error("Category does not exist");
        }

        // Check if the user is already subscribed to the category
        if (category.subscriberIDs.includes(userId)) {
          throw new Error("You have already subscribed to this category.");
        }

        // Update the category to connect the user and increment subscriber count
        const updatedCategory = await prisma.category.update({
          where: { id: categoryId },
          data: {
            subscribers: {
              connect: { id: userId },
            },
            subscriberCount: {
              increment: 1,
            },
          },
          include: categoryPopulated, // Include related data as defined in include options
        });

        // Find the user who was updated
        const userUpdated = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!userUpdated) {
          throw new Error("Failed to find userUpdated");
        }

        // Publish the updated user to the USER_FOLLOW_CATEGORY channel
        pubsub.publish("USER_FOLLOW_CATEGORY", {
          userUpdated: userUpdated,
        });

        return updatedCategory;
      } catch (error) {
        console.error("subscribeToCategory error", error);
        throw new GraphQLError("Error subscribing to the category");
      }
    },

    // Unsubscribe a user from a category
    unsubscribeToCategory: async function (
      _: any,
      args: SubscribeCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma, pubsub } = context;

      // Check if the user is authenticated
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { categoryId, userId } = args;

      try {
        // Find the category by its ID
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new Error("Category does not exist");
        }

        // Check if the user is already unsubscribed from the category
        if (!category.subscriberIDs.includes(userId)) {
          throw new Error("You have already unsubscribed from this category.");
        }

        // Update the category to disconnect the user and decrement subscriber count
        const updatedCategory = await prisma.category.update({
          where: { id: categoryId },
          data: {
            subscribers: {
              disconnect: { id: userId },
            },
            subscriberCount: {
              decrement: 1,
            },
          },
          include: categoryPopulated, // Include related data as defined in include options
        });

        // Find the user who was updated
        const userUpdated = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!userUpdated) {
          throw new Error("Failed to find userUpdated");
        }

        // Publish the updated user to the USER_FOLLOW_CATEGORY channel
        pubsub.publish("USER_FOLLOW_CATEGORY", {
          userUpdated: userUpdated,
        });

        return updatedCategory;
      } catch (error) {
        console.error("unsubscribeToCategory error", error);
        throw new GraphQLError("Error unsubscribing from the category");
      }
    },
  },
  Subscription: {
    // Subscribe to updates when a user follows a category
    userUpdated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;

        // Subscribe to the "USER_FOLLOW_CATEGORY" channel
        return pubsub.asyncIterator("USER_FOLLOW_CATEGORY");
      },
    },
  },
};

// Define a Prisma query selection validator for a populated category
export const categoryPopulated = Prisma.validator<Prisma.CategoryInclude>()({
  // Include the 'posts' relation and select the 'id' field
  posts: {
    select: {
      id: true,
    },
  },
  // Include the 'subscribers' relation and select the 'id' field
  subscribers: {
    select: {
      id: true,
    },
  },
});


export default resolvers;
