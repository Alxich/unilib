import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateTagArguments,
  TagPopulated,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
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
        console.log("Tags error", error);
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

      const { id, title } = args;

      try {
        /**
         * Create new post entity
         */
        const newTag = await prisma.tag.create({
          data: {
            id,
            title,
          },
          include: tagPopulated,
        });

        console.log(newTag);

        return true;
      } catch (error) {
        console.log("createTag error", error);
        throw new GraphQLError("Error sending message");
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
