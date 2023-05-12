import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateCategoryArguments,
  CategoryPopulated,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    queryCategory: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Array<CategoryPopulated>> {
      const { session, prisma } = context;
      const { id: catID } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const categories = await prisma.category.findMany({
          where: {
            id: catID,
          },
          include: categoryPopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

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

      const { id, title, desc } = args;

      try {
        /**
         * Create new category entity
         */
        const newCategory = await prisma.category.create({
          data: {
            id,
            title,
            desc,
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
  },
};

export const categoryPopulated = Prisma.validator<Prisma.CategoryInclude>()({
  posts: {
    select: {
      id: true,
    },
  },
});

export default resolvers;
