"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { ShippingFormInputs } from "../../../types";
import { ArrowRight, Trash2 } from "lucide-react";
import { PRICING } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import useBagStore from "@/stores/bagStore";
import submitOrder from "@/actions/submitOrder";
import { toast } from "react-toastify";
import calculatePrice from "@/lib/calculatePrice";
import Image from "next/image";
import RemainingShares from "@/components/RemainingShares";
import Link from "next/link";

const steps = [
  { id: 1, name: "Shopping Bag" },
  { id: 2, name: "Address" },
  { id: 3, name: "Payment" },
];

const pricePerShare = (askingPrice: number, noOfShares: number) => {
  if (noOfShares <= 0) {
    console.warn(`Invalid noOfShares value: ${noOfShares}. Defaulting to 1.`);
    return calculatePrice(askingPrice, 1);
  }
  return calculatePrice(askingPrice, noOfShares);
};
export default function BagPage() {
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeStep = parseInt(searchParams.get("step") || "1");
  const { bag, removeFromBag, emptyBag } = useBagStore();

  const total = formatCurrency(
    bag.reduce(
      (acc, item) =>
        acc +
        pricePerShare(item.askingPrice, item.noOfShares) * item.shares +
        (shippingForm?.district === item.district || !shippingForm?.district
          ? PRICING.SHIPPING_INSIDE_CITY
          : PRICING.SHIPPING_OUTSIDE_CITY),
      0,
    ),
  );

  const handleOrderSubmit = async ({
    method,
    transactionId,
  }: {
    method: string;
    transactionId?: string;
  }) => {
    if (!shippingForm) {
      toast.error("Shipping information is missing");
      return;
    }
    try {
      const success = await submitOrder({
        shippingForm,
        payment: { method, transactionId },
        bag,
      });
      emptyBag();
      toast.success(`Order placed successfully for: ${success.join(", ")}`);
      router.replace("/", { scroll: false });
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep ? "border-accent" : "border-muted"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-accent" : "bg-muted"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {step.name}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-16">
        <div
          className={`w-full shadow-lg border border-border bg-card p-8 rounded-lg flex flex-col gap-8 ${
            bag.length !== 0 ? "lg:w-7/12" : ""
          }`}
        >
          {bag.length === 0 && <p className="self-center">Your shopping bag looks empty</p>}
          {activeStep === 1 ? (
            bag.map((item) => (
              // SINGLE CART ITEM
              <div className="flex items-center justify-between" key={item.id}>
                {/* IMAGE AND DETAILS */}
                <div className="flex gap-8">
                  <Link
                    href={`/products/${item.id}`}
                    className="relative w-32 h-32 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={item.productImages[0]?.url}
                      alt={item.title}
                      fill
                      className="object-contain rounded-md"
                    />
                  </Link>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Quantity: {item.shares}</p>
                      <p className="text-xs text-muted-foreground">
                        Remaining <RemainingShares product={item} size="text-sm" />
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatCurrency(pricePerShare(item.askingPrice, item.noOfShares))}
                        <span className="text-accent-foreground text-sm"> x{item.shares}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant={"destructive"}
                  className="w-8 h-8 duration-300 hover:scale-110 hover:text-accent-foreground"
                  onClick={() => removeFromBag(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          ) : activeStep === 2 && bag.length !== 0 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <PaymentForm handleOrderSubmit={handleOrderSubmit} />
          ) : (
            <p className="text-sm text-destructive">Please fill in shipping address to continue.</p>
          )}
        </div>
        {bag.length !== 0 && (
          <div className="w-full lg:w-5/12 shadow-lg border border-border bg-card p-8 rounded-lg flex flex-col gap-8 h-max">
            <h2 className="font-semibold">Details</h2>
            <div className="flex flex-col gap-4">
              {bag.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">
                      {item.title}
                      <span className="text-xs text-accent-foreground">
                        {"  x"}
                        {item.shares}
                      </span>
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        pricePerShare(item.askingPrice, item.noOfShares) * item.shares,
                      )}
                    </p>
                  </div>
                  {shippingForm?.district === item.district || !shippingForm?.district ? (
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground text-xs">Delivery Fee (Inside City)</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(PRICING.SHIPPING_INSIDE_CITY)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground text-xs">Delivery Fee (Outside City)</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(PRICING.SHIPPING_OUTSIDE_CITY)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <p className="text-muted-foreground font-semibold">Total</p>
                <p className="font-medium">{total}</p>
              </div>
            </div>
            {activeStep === 1 && (
              <Button
                onClick={() => router.replace("/bag?step=2", { scroll: false })}
                className="w-full duration-300 hover:scale-110 p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
