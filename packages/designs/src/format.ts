import type { Money } from "@bloom/core";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export function formatMoney(price: Money | undefined): string {
  return price ? naira.format(price.amount) : "Price on request";
}
