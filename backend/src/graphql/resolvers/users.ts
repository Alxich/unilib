import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { verifyAndCreateUsername } from "../../util/functions";
import {
  CreateItemResoponse,
  DeleteItemResoponse,
  FollowUserResponse,
  GraphQLContext,
} from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: async function searchUsers(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> {
      const { username: searchedUsername } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("error", error);
        throw new GraphQLError(error?.message);
      }
    },

    searchUser: async function searchUser(
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<User> {
      const { id } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        });

        if (!user) {
          throw new GraphQLError("No user found");
        }

        return user;
      } catch (error: any) {
        console.log("error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async function createUsername(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id } = session.user;
      const { username } = args;

      return await verifyAndCreateUsername({ userId: id, username }, prisma);
    },

    followUser: async function name(
      _: any,
      args: { followerId: string; followingId: string },
      context: GraphQLContext
    ): Promise<FollowUserResponse> {
      const { followerId, followingId } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const follow = await prisma.follows.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      });

      return follow;
    },

    unfollowUser: async function name(
      _: any,
      args: { followerId: string; followingId: string },
      context: GraphQLContext
    ): Promise<DeleteItemResoponse> {
      const { followerId, followingId } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const follow = await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      });

      if (follow) {
        return {
          success: true,
        };
      } else {
        return {
          error: "Something went wrong",
        };
      }
    },
  },
};

export default resolvers;
