import { Prisma } from "@prisma/client";
import {
  GraphQLContext,
  CreatePostArguments,
  PostPopulated,
} from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    queryPosts: async function (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { session, prisma } = context;
      const { id: postID } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const posts = await prisma.post.findMany({
          where: {
            id: postID,
          },
          include: postPopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

        return posts;
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

      const { id, title, content, authorId, authorName } = args;

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
            authorName,
          },
          include: postPopulated,
        });

        console.log(newPost);

        return true;
      } catch (error) {
        console.log("sendMessage error", error);
        throw new GraphQLError("Error sending message");
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
});

export default resolvers;
