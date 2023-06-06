import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateCategoryArguments,
  CategoryPopulated,
  SubscribeCategoryArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    queryCategory: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { prisma } = context;
      const { id: catID } = args;

      try {
        const category = await prisma.category.findUnique({
          where: {
            id: catID,
          },
          include: categoryPopulated,
        });

        if (!category) {
          throw new Error("Category is not exist");
        }

        return category;
      } catch (error: any) {
        console.log("Categories error", error);
        throw new GraphQLError(error?.message);
      }
    },
    queryCategories: async function (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<CategoryPopulated>> {
      const { prisma } = context;

      try {
        const categories = await prisma.category.findMany({
          include: categoryPopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

        if (!categories) {
          throw new Error("Categories is not exist");
        }

        return categories;
      } catch (error: any) {
        console.log("Categories error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createCategory: async function (
      _: any,
      args: CreateCategoryArguments,
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title, desc, banner, icon } = args;

      try {
        /**
         * Create new category entity
         */
        const newCategory = await prisma.category.create({
          data: {
            id,
            title,
            desc,
            banner,
            icon,
          },
          include: categoryPopulated,
        });

        console.log(newCategory);

        return true;
      } catch (error) {
        console.log("createCategory error", error);
        throw new GraphQLError("Error sending message");
      }
    },

    subscribeToCategory: async function (
      _: any,
      args: SubscribeCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { categoryId, userId } = args;

      try {
        /**
         * Subscribe new user to category
         */
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new Error("Category is not exist");
        }

        if (category.subscriberIDs.includes(userId)) {
          throw new Error("You have already subscribed this category.");
        }

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
          include: categoryPopulated,
        });

        return updatedCategory;
      } catch (error) {
        console.log("subscribeToCategory error", error);
        throw new GraphQLError("Error to subscribe category");
      }
    },

    unsubscribeToCategory: async function (
      _: any,
      args: SubscribeCategoryArguments,
      context: GraphQLContext
    ): Promise<CategoryPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { categoryId, userId } = args;

      try {
        /**
         * unsubscribe new user to category
         */
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new Error("Category is not exist");
        }

        if (!category.subscriberIDs.includes(userId)) {
          throw new Error("You have already unsubscribed this category.");
        }

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
          include: categoryPopulated,
        });

        return updatedCategory;
      } catch (error) {
        console.log("unsubscribeToCategory error", error);
        throw new GraphQLError("Error to unsubscribe category");
      }
    },
  },
};

export const categoryPopulated = Prisma.validator<Prisma.CategoryInclude>()({
  posts: {
    select: {
      id: true,
    },
  },
  subscribers: {
    select: {
      id: true,
    },
  },
});

export default resolvers;
