export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;

  const date = new Date();
  date.setHours(hour, minute, 0);

  const label = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    label,
    value: label,
  };
});

export const getFsaBadgeUrl = (rating: string) => {
  switch (rating) {
    case "5":
    case "4":
    case "3":
    case "2":
    case "1":
      return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
    case "AwaitingInspection":
    case "Exempt":
    case "AwaitingPublication":
      return `https://ratings.food.gov.uk/images/badges/fhrs/1/fhrs-badge-${rating}.svg`;
    default:
      return null;
  }
};
