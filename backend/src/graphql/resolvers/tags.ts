import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateTagArguments,
  TagPopulated,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    queryTag: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<TagPopulated> {
      const { session, prisma } = context;
      const { id: tagID } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        if (!tagID) {
          throw new GraphQLError("Not id inserted");
        }

        const tag = await prisma.tag.findUnique({
          where: {
            id: tagID,
          },
          include: tagPopulated,
        });

        if (!tag) {
          throw new GraphQLError("No such a tag 404");
        }

        return tag;
      } catch (error: any) {
        console.error("Tags error", error);
        throw new GraphQLError(error?.message);
      }
    },

    queryTags: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Array<TagPopulated>> {
      const { session, prisma } = context;
      const { id: tagID } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const tags = await prisma.tag.findMany({
          where: {
            id: tagID,
          },
          include: tagPopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

        return tags;
      } catch (error: any) {
        console.error("Tags error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createTag: async function (
      _: any,
      args: CreateTagArguments,
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { title } = args;

      try {
        /**
         * Create new tag entity
         */
        const newTag = await prisma.tag.create({
          data: {
            title,
          },
          include: {
            ...tagPopulated,
          },
        });

        return true;
      } catch (error) {
        console.error("createTag error", error);
        throw new GraphQLError("Error creating tag");
      }
    },
  },
};

export const tagPopulated = Prisma.validator<Prisma.TagInclude>()({
  posts: {
    select: {
      id: true,
    },
  },
});

export default resolvers;
