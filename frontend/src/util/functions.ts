import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Session } from "next-auth";

import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../backend/src/util/types";

/**
 * Formate usernames for easy read
 */

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  // Filter participants to exclude the user with myUserId
  const usernames = participants
    .filter((participant) => participant.user.id !== myUserId)
    .map((participant) => participant.user.username);

  // Join the formatted usernames into a comma-separated string
  return usernames.join(", ");
};

/**
 * Function return the normal style of time
 * for user understanding
 *
 *  Define the function to format time or date to a readable format
 */

export function formatTimeToPost(createdAt: number | Date | undefined) {
  // Object that maps date-fns format tokens to custom formats
  const formatRelativeLocale = {
    lastWeek: "eeee", // Display day of the week
    yesterday: "'Yesterday", // Display "Yesterday"
    today: "p", // Display time (e.g., "1:30 PM")
    other: "MM/dd/yy", // Display date in MM/dd/yy format
  };

  // Format the input createdAt using formatRelative function
  const value = createdAt
    ? formatRelative(createdAt, new Date(), {
        locale: {
          ...enUS,
          // Override date-fns's formatRelative function with custom formats
          formatRelative: (token) =>
            formatRelativeLocale[token as keyof typeof formatRelativeLocale],
        },
      })
    : "2022-12-22"; // Default value in case createdAt is undefined

  return value;
}

/**
 * Offer a user funny text errors
 */

export function returnMeFunnyError(): string {
  // An array of predefined funny error messages
  // Feel free to add more fancy error messages to this array
  const texts = [
    "Ого, помилка! Щось зламалось. Ми вражені твоїм натхненням для знайомства з нашою чудовою сторінкою помилки. Тримайся, ми незабаром все поремонтуємо і повернемо тебе на правильний шлях. Зараз же ти маєш унікальну можливість подивитися нашу сторінку помилки зсередини!",
    "О, щойно потрапив на найцікавішу сторінку помилок! Ти щасливчик, друже! Але, на жаль, не можу сказати те ж саме про програмістів... Ми вже працюємо над виправленням цієї неймовірної помилки. Тим часом, насолоджуйся цим шедевром програмування та графіки помилок!    ",
    "Вау! Щось пішло не так... Але не зважай на це, хіба це важливо? Залишайся з нами та насолоджуйся цією надзвичайно цікавою помилкою! 😄",
    "Ого, ти тут? Ну ти щось наробив! Тепер ти можеш насолоджуватися цією шикарною помилкою. Ми вже працюємо над виправленням, а ти, на всяк випадок, насолоджуйся!",
    "О, класно! Спрацювало! Помилка – наш новий хіт! 😒",
    "О, ти знову тут, геній програмування? Все знову зламав, як завжди? Чудово, знову я латаю твої діряві коди! 😠",
    "О, ви, шановний користувач, знову щось натворили? 🙄 Ви точно великий експерт у робітниках над сценаріями! От і знову помилка через вашу вину! Ну що ж, насолоджуйтесь своїм шедевром! 😒",
    "О, а ось і наш 'чемний' користувач, який під час навігації поклав долар на клавішу 'Завалити все'. Вітаємо! Ви просто майстер зненацька! 🙄😤",
    "Ого, вау! Ну вітаю! Ти знову щось зламав! Чудова робота! 👏😒",
    "О, дякую, що зробив мене генієм програмування! Знову все зламав, як зазвичай. Так, це вже стало традицією – робити всьому хаос! 🙄",
    "Ой-ой! Щось ви не те натиснули, і сталася помилка. Вибачте, та швиденько поправлю!",
    "Винна ти, а не я! Страшно нестачає мемів, щоб виправити твої халепи. Ремонтуй швидше, а то нічого доброго не вийде! 😏🔧",
    "Що за катастрофа тут сталася? Вибач, але це жахливо!",
  ];

  // Generate a random index to select a message from the array
  const randomIndex = Math.floor(Math.random() * texts.length);
  // Get the random text based on the random index
  const randomText = texts[randomIndex];

  // Return the selected random error message
  return randomText;
}

/**
 * Define the function to get a participant object for the current user from a conversation
 */

export function getUserParticipantObject(
  session: Session,
  conversation: ConversationPopulated
) {
  // Define the inner function getParticipantObject
  const getParticipantObject = () => {
    // Find and return the participant object whose user ID matches the session's user ID
    return conversation.participants.find(
      (p) => p.user.id === session.user.id
    ) as ParticipantPopulated; // Cast the result to ParticipantPopulated type
  };

  // Call the inner function to get the participant object and return it
  return getParticipantObject();
}

