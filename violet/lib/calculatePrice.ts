import { PRICING } from "@/constants";

export default function calculatePrice(askingPrice: number, noOfShares: number): number {
  return (
    Math.ceil(Math.floor((askingPrice * PRICING.MARKUP_MULTIPLIER) / noOfShares) / 10) * 10 - 1
  );
}
