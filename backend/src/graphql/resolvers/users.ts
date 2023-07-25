import { Prisma, User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { verifyAndCreateUsername } from "../../util/functions";
import {
  CreateItemResoponse,
  DeleteItemResoponse,
  FollowUserResponse,
  GraphQLContext,
  UserPopulated,
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
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },

    searchUser: async function searchUser(
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<UserPopulated> {
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
          include: userPopulated,
        });

        if (!user) {
          throw new GraphQLError("No user found");
        }

        return user;
      } catch (error: any) {
        console.error("Error", error);
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

    updateUser: async function updateUser(
      _: any,
      args: {
        username?: string;
        desc?: string;
        image?: string;
        banner?: string;
        password?: string;
      },
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma } = context;
      const { username, desc, image, banner } = args;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id: sessionId, username: sessionUsername } = session.user;

      const user = await prisma.user.findUnique({
        where: {
          id: sessionId,
        },
        include: userPopulated,
      });

      if (!user) {
        return {
          error: "Not user found",
        };
      }

      let updateUserResult: CreateItemResoponse = {
        success: false,
        error: undefined,
      };

      const updateOtherUserValues = async (newValues: {
        aboutMe?: string;
        image?: string;
        banner?: string;
      }): Promise<CreateItemResoponse> => {
        const { aboutMe, banner, image } = newValues;

        if (newValues) {
          try {
            const data = await prisma.user.updateMany({
              where: {
                id: sessionId,
              },
              data: {
                ...{
                  ...(user.aboutMe !== aboutMe && aboutMe && { aboutMe }),
                  ...(user.image !== image && image && { image }),
                  ...(user.banner !== banner && banner && { banner }),
                },
              },
            });

            console.log(data);

            return { success: true };
          } catch (error: any) {
            console.error("updateDesc error", error);
            return {
              error: error?.message as string,
            };
          }
        } else {
          return { error: "Not provided with new data" };
        }
      };

      if (username && username !== sessionUsername) {
        updateUserResult = await verifyAndCreateUsername(
          { userId: sessionId, username },
          prisma
        );
      }

      if (user) {
        updateUserResult = await updateOtherUserValues({
          aboutMe: desc,
          banner: banner,
          image: image,
        });
      }

      if (updateUserResult.success !== true) {
        console.error(
          "Error occured while updating user",
          updateUserResult.error
        );
        return updateUserResult;
      } else {
        return updateUserResult;
      }
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

export const userPopulated = Prisma.validator<Prisma.UserInclude>()({
  followedBy: {
    select: {
      id: true,
      follower: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      following: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  },
  following: {
    select: {
      id: true,
      follower: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      following: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  },
});

export default resolvers;
