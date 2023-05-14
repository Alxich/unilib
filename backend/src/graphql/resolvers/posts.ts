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
      args: { postID: string; skip: number; take: number },
      context: GraphQLContext
    ): Promise<Array<PostPopulated>> {
      const { session, prisma } = context;
      const { skip, take } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

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
              create: tagsId.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
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
      tag: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  },
});

export default resolvers;
