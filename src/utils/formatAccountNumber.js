export function formatAccountNumber(number, { type, masked = true }) {
  if (!number) return "";

  const string = number.toString();

  const isCard = !!type.includes("Card");

  const formattedType = isCard ? "card" : "account";

  const formats = {
    account: [string.slice(0, 3), string.slice(3, 6)],
    card: [string.slice(0, 4), string.slice(4, 8)],
  };

  if (type === "card" && string.length > 16) {
    formats["card"].push(string.slice(8, 12), string.slice(12, -4));
  } else {
    formats["card"].push(string.slice(8, -4));
  }

  const lastFour = masked ? "****" : string.slice(-4);

  return `${formats[formattedType].join(" ")} ${lastFour}`;
}
