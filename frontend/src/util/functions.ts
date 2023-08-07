import { ParticipantPopulated } from "../../../backend/src/util/types";

import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};

export function formatTimeToPost(createdAt: number | Date | undefined) {
  const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
  };

  const value = createdAt
    ? formatRelative(createdAt, new Date(), {
        locale: {
          ...enUS,
          formatRelative: (token) =>
            formatRelativeLocale[token as keyof typeof formatRelativeLocale],
        },
      })
    : "2022-12-22";

  return value;
}

export function returnMeFunnyError(): string {
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
    "Що за катастрофа тут сталася? Вибач, але це жахливо!"
  ];
  const randomIndex = Math.floor(Math.random() * texts.length);
  const randomText = texts[randomIndex];

  return randomText;
}