import { PrismaClient } from "@prisma/client";
import { CreateItemResoponse, ParticipantPopulated } from "./types";

// Console output 
import kleur from "kleur"

export function helloServer(PORT: number) {
  console.log(" ");
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|--------------------------------------------------------|")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow(`| Server is now running on http://localhost:${PORT}/graphql |`)
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|--------------------------------------------------------|")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|                      ＼(￣▽￣)／                       |")
  );
  console.log(kleur.bold().yellow(" |                                                        | "));
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|              Welcome to the GraphQL server!            |")
  );
  console.log(kleur.bold().yellow(" |                                                        | "));
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|    Feel free to explore and interact with the API.     |")
  );
  console.log(kleur.bold().yellow(" |                                                        | "));
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|                     Happy coding!                      |")
  );
  console.log(kleur.bold().yellow(" |--------------------------------------------------------| "));
}

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
    console.error("createUsername error", error);
    return {
      error: error?.message as string,
    };
  }
}

// A function to check if a user is a participant in a conversation
export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  // Using the Array.prototype.find() method to look for a participant with a matching userId
  // If a matching participant is found, the function will return true
  // If no matching participant is found, the function will return false
  return !!participants.find((participant) => participant.userId === userId);
}

// A function to calculate the start and end dates based on a selected period
export function getDateQueryRange(period: string) {
  const currentDate = new Date();

  let startDate: Date;
  let endDate: Date;

  // We calculate the start and end dates depending on the selected period
  switch (period) {
    case "today":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
    case "week":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
    case "month":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
    case "year":
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
    case "follow":
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
    default:
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      break;
  }

  return {startDate, endDate}
}