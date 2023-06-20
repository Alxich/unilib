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