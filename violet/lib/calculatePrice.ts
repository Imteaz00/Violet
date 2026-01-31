import { PRICING } from "@/constants";

export default function calculatePrice(askingPrice: number, noOfShares: number): number {
  if (noOfShares <= 0) {
    throw new Error("noOfShares must be a positive number");
  }
  if (askingPrice < 0) {
    throw new Error("askingPrice cannot be negative");
  }
  return (
    Math.ceil(Math.floor((askingPrice * PRICING.MARKUP_MULTIPLIER) / noOfShares) / 10) * 10 - 1 // Round up to nearest ..9
  );
}
