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

export function getDateQueryRange(period: string) {
  const currentDate = new Date();

  let startDate: Date;
  let endDate: Date;

  // We calculate the start and end dates depending on the selected period
  switch (period) {
    case 'today':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      break;
    case 'week':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      break;
    case 'month':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      break;
    case 'year':
      startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      break;
    default:
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      break;
  }

  return {startDate, endDate}
}