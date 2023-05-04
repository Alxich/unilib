import { PrismaClient } from "@prisma/client";
import { CreateItemResoponse, ParticipantPopulated } from "./types";

export async function verifyAndCreateUsername(
  args: { userId: string; username: string },
  prisma: PrismaClient
): Promise<CreateItemResoponse> {
  const { userId, username } = args;

  try {
    /**
     * Check if username taken by another user
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return {
        error: "Username already taken. Try another",
      };
    }

    /**
     * update username
     */
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.log("createUsername error", error);
    return {
      error: error?.message as string,
    };
  }
}

export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  return !!participants.find((participant) => participant.userId === userId);
}