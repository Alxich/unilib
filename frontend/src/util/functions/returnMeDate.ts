export function returnMeDate(dateType: "en" | "ua") {
  // Format date in a specific way
  const date = new Date();

  const monthNames =
    dateType === "ua"
      ? [
          "Січень",
          "Лютий",
          "Березень",
          "Квітень",
          "Травень",
          "Червень",
          "Липень",
          "Серпень",
          "Вересень",
          "Жовтень",
          "Листопад",
          "Грудень",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

  const month = date.getMonth();
  const year = date.getFullYear();

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${monthNames[month]} ${year} рік ${time}`;
}
