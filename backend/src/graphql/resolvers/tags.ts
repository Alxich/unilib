import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreateTagArguments,
  TagPopulated,
  UpdateTagArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    /**
     * Query a specific tag by its ID.
     */
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
          throw new GraphQLError("No ID inserted");
        }

        // Query the tag by its ID and include additional information using tagPopulated
        const tag = await prisma.tag.findUnique({
          where: {
            id: tagID,
          },
          include: tagPopulated,
        });

        if (!tag) {
          throw new GraphQLError("Tag not found");
        }

        return tag;
      } catch (error: any) {
        console.error("Tags error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Query tags based on the provided tag IDs.
     */
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
        // Query tags based on the provided tag IDs and include additional information using tagPopulated
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
    /**
     * Create a new tag.
     */
    createTag: async function (
      _: any,
      args: CreateTagArguments,
      context: GraphQLContext
    ): Promise<TagPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title } = args;

      try {
        // Create a new tag entity in the database
        const newTag = await prisma.tag.create({
          data: {
            id,
            title,
          },
          include: {
            ...tagPopulated,
          },
        });

        return newTag;
      } catch (error) {
        console.error("createTag error", error);
        throw new GraphQLError("Error creating tag");
      }
    },

    /**
     * Update a new tag.
     */
    updateTag: async function (
      _: any,
      args: UpdateTagArguments,
      context: GraphQLContext
    ): Promise<TagPopulated> {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id, title } = args;

      try {
        // Update a new tag entity in the database
        const newTag = await prisma.tag.update({
          where: {
            id,
          },
          data: {
            title,
          },
          include: {
            ...tagPopulated,
          },
        });

        return newTag;
      } catch (error) {
        console.error("updateTag error", error);
        throw new GraphQLError("Error creating tag");
      }
    },
  },
};

/**
 * Validator for including additional information when querying a tag.
 * Includes information about the posts associated with the tag.
 */
export const tagPopulated = Prisma.validator<Prisma.TagInclude>()({
  posts: {
    select: {
      id: true,
    },
  },
});


export default resolvers;
