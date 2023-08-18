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
    /**
     * Search for users based on a provided username.
     * This function searches for users whose username contains the provided text,
     * excluding the current user's own username.
     */
    searchUsers: async function searchUsers(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> {
      const { username: searchedUsername } = args;
      const { prisma, session } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      // Get the current user's username
      const {
        user: { username: myUsername },
      } = session;

      try {
        // Search for users with matching usernames, excluding the current user
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
        // Handle errors and throw a GraphQLError
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Query all users throw the site.
     * This function retrieves users information about their admin status,
     * not based on any provided data.
     */
    queryFisrtAdmin: async function queryFisrtAdmin(
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { prisma, session } = context;

      // Check if the user is authorized
      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      // Search in base if there is existing admin
      const existingAdmin = await context.prisma.user.findFirst({
        where: {
          isAdmin: true,
        },
      });

      if (existingAdmin) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
        };
      }
    },

    /**
     * Query all users throw the site.
     * This function retrieves users information including populated data,
     * not based on any provided data.
     */
    queryUsers: async function queryUsers(
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<User>> {
      const { prisma, session } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // Search for users for next operations
        const users = await prisma.user.findMany({});

        return users;
      } catch (error: any) {
        // Handle errors and throw a GraphQLError
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },

    /**
     * Search for a user by their ID.
     * This function retrieves user information including populated data,
     * based on the provided user ID.
     */
    searchUser: async function searchUser(
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<UserPopulated> {
      const { id } = args;
      const { prisma, session } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // Search for the user by ID and retrieve populated data
        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
          include: userPopulated,
        });

        // If user not found, throw an error
        if (!user) {
          throw new GraphQLError("No user found");
        }

        return user;
      } catch (error: any) {
        // Handle errors and throw a GraphQLError
        console.error("Error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    /**
     * Create a new username for the authenticated user.
     * This function allows the authenticated user to create a new username.
     */
    createUsername: async function createUsername(
      _: any,
      args: { username: string; wantBeAdmin?: boolean },
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      // Extract user ID and desired username from the arguments
      const { id } = session.user;
      const { username, wantBeAdmin } = args;

      // Search in base if there is existing admin
      const existingAdmin = await context.prisma.user.findFirst({
        where: {
          isAdmin: true,
        },
      });

      // Use the verifyAndCreateUsername function to handle username creation
      if (wantBeAdmin !== undefined && !existingAdmin) {
        console.log(wantBeAdmin);

        return await verifyAndCreateUsername(
          { userId: id, username, wantBeAdmin },
          prisma
        );
      } else {
        return await verifyAndCreateUsername({ userId: id, username }, prisma);
      }
    },

    /**
     * Update user information.
     * This function allows an authenticated user to update their profile information.
     */
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

      // Check if the user is authorized
      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id: sessionId, username: sessionUsername } = session.user;

      // Find the user's existing information
      const user = await prisma.user.findUnique({
        where: {
          id: sessionId,
        },
        include: userPopulated,
      });

      if (!user) {
        return {
          error: "User not found",
        };
      }

      // Initialize the result object for the update operation
      let updateUserResult: CreateItemResoponse = {
        success: false,
        error: undefined,
      };

      // Function to update other user values (aboutMe, image, banner)
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

            return { success: true };
          } catch (error: any) {
            console.error("updateDesc error", error);
            return {
              error: error?.message as string,
            };
          }
        } else {
          return { error: "No new data provided" };
        }
      };

      // Check if the provided username is different from the current session username
      if (username && username !== sessionUsername) {
        updateUserResult = await verifyAndCreateUsername(
          { userId: sessionId, username },
          prisma
        );
      }

      // Update other user values if they are provided
      if (user) {
        updateUserResult = await updateOtherUserValues({
          aboutMe: desc,
          banner: banner,
          image: image,
        });
      }

      // Handle and return the result of the update operation
      if (updateUserResult.success !== true) {
        console.error(
          "An error occurred while updating the user",
          updateUserResult.error
        );
        return updateUserResult;
      } else {
        return updateUserResult;
      }
    },

    /**
     * Update user information from admin panel.
     * This function allows an authenticated admin to update users information.
     */
    updateUserByAdmin: async function updateUser(
      _: any,
      args: {
        id: string;
        username?: string;
        desc?: string;
        image?: string;
        banner?: string;
        password?: string;
      },
      context: GraphQLContext
    ): Promise<CreateItemResoponse> {
      const { session, prisma } = context;
      const { id, username, desc, image, banner } = args;

      // Check if the user is authorized
      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      // Find the user's existing information
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        include: userPopulated,
      });

      if (!user) {
        return {
          error: "User not found",
        };
      }

      // Initialize the result object for the update operation
      let updateUserResult: CreateItemResoponse = {
        success: false,
        error: undefined,
      };

      // Function to update other user values (aboutMe, image, banner)
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
                id: id,
              },
              data: {
                ...{
                  ...(user.aboutMe !== aboutMe && aboutMe && { aboutMe }),
                  ...(user.image !== image && image && { image }),
                  ...(user.banner !== banner && banner && { banner }),
                },
              },
            });

            return { success: true };
          } catch (error: any) {
            console.error("updateDesc error", error);
            return {
              error: error?.message as string,
            };
          }
        } else {
          return { error: "No new data provided" };
        }
      };

      // Check if the provided username is different from the current session username
      if (username) {
        updateUserResult = await verifyAndCreateUsername(
          { userId: id, username },
          prisma
        );
      }

      // Update other user values if they are provided
      if (user) {
        updateUserResult = await updateOtherUserValues({
          aboutMe: desc,
          banner: banner,
          image: image,
        });
      }

      // Handle and return the result of the update operation
      if (updateUserResult.success !== true) {
        console.error(
          "An error occurred while updating the user",
          updateUserResult.error
        );
        return updateUserResult;
      } else {
        return updateUserResult;
      }
    },

    /**
 * Follow a user.
 * This function allows an authenticated user to follow another user.

 */
    followUser: async function name(
      _: any,
      args: { followerId: string; followingId: string },
      context: GraphQLContext
    ): Promise<FollowUserResponse> {
      const { followerId, followingId } = args;
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      // Create the follow relationship
      const follow = await prisma.follows.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      });

      return follow;
    },

    /**
     * Unfollow a user.
     * This function allows an authenticated user to unfollow another user.
     */
    unfollowUser: async function name(
      _: any,
      args: { followerId: string; followingId: string },
      context: GraphQLContext
    ): Promise<DeleteItemResoponse> {
      const { followerId, followingId } = args;
      const { session, prisma } = context;

      // Check if the user is authorized
      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      // Delete the follow relationship
      const follow = await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      });

      // Check if the follow relationship was successfully deleted
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

// Define the userPopulated Prisma validator to include specific fields and relationships when querying users
export const userPopulated = Prisma.validator<Prisma.UserInclude>()({
  posts: {
    select: {
      id: true,
    },
  },
  // Include information about users who are following the current user
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
  // Include information about users who the current user is following
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
