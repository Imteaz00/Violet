"use client";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import Image from "next/image";

export default function PaymentForm({
  handleOrderSubmit,
}: {
  handleOrderSubmit: ({
    method,
    transactionId,
  }: {
    method: string;
    transactionId?: string;
  }) => void;
}) {
  const [selectedPayment, setSelectedPayment] = useState("cashOnDelivery");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      handleOrderSubmit({ method: selectedPayment, transactionId: transactionId || undefined });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("01752882255");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="w-full max-w-md">
        <FieldGroup>
          <FieldSet>
            <FieldLabel htmlFor="paymentMethod">Payment Method</FieldLabel>
            <FieldDescription>Select the payment method for your purchase.</FieldDescription>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <FieldLabel htmlFor="cashOnDelivery">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Cash on Delivery</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="cashOnDelivery" id="cashOnDelivery" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="bkash">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      <Image
                        src="/bkash-logo.png"
                        alt="Bkash Logo"
                        width={50}
                        height={20}
                        className="bg-foreground"
                      />
                      Bkash
                    </FieldTitle>
                    <FieldDescription>
                      {selectedPayment === "bkash" && (
                        <Field>
                          <FieldTitle className="text-xl">
                            01752882255
                            <Button
                              title="Copy Number"
                              disabled={copied}
                              variant={"ghost"}
                              className="ml-2 border-2"
                              onClick={handleCopy}
                            >
                              {copied ? "Copied" : <CopyIcon />}
                            </Button>
                          </FieldTitle>
                          <FieldLabel htmlFor="transactionId">Transaction Id</FieldLabel>
                          <Input
                            id="transactionId"
                            type="text"
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                          <FieldDescription>
                            Enter the transaction ID from your Bkash payment.
                          </FieldDescription>
                        </Field>
                      )}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="bkash" id="bkash" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
        </FieldGroup>
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full duration-300 hover:scale-110 transition-all"
              disabled={selectedPayment === "bkash" && transactionId.trim() === ""}
            >
              Confirm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Order?</DialogTitle>
              <DialogDescription>
                Payment Method:{" "}
                {selectedPayment === "cashOnDelivery" ? "Cash on Delivery" : "Bkash"}
                {selectedPayment === "bkash" && <p>Transaction ID: {transactionId}</p>}
                <Button
                  onClick={handleSubmit}
                  className="mt-2 w-full duration-300 hover:scale-105 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
