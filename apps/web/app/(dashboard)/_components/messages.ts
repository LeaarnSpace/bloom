// Errors are passed back to forms as ?error=<code> so the dashboard works without client JS.
const MESSAGES: Record<string, string> = {
  identifier: "Enter a valid email address or Nigerian mobile number.",
  wait: "A code was sent recently. Wait 30 seconds before asking for another.",
  code: "That code is wrong or has expired.",
  expired: "Your sign-in attempt expired. Start again.",
  name: "Enter a business name (2–80 characters).",
  description: "Enter a description (10–2000 characters).",
  title: "Enter a title (3–120 characters).",
  category: "Choose a category.",
  city: "Choose a city.",
  price: "Enter the price as a whole number of naira, or leave it empty.",
  phone: "Enter a valid Nigerian mobile number, or leave it empty.",
};

export function errorMessage(code: string | string[] | undefined): string | undefined {
  return typeof code === "string" ? (MESSAGES[code] ?? "Something went wrong.") : undefined;
}
