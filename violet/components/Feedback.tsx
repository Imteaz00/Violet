"use client";
import { useRef, useState } from "react";
import sendMessage from "@/actions/sendMessage";
import { toast } from "react-toastify";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function Feedback() {
  const [isLoading, setIsLoading] = useState(false);
  async function handleMessage(text: string) {
    setIsLoading(true);
    try {
      const data = await sendMessage({ receiver: "admin", text });
      if (data === undefined || data?.error) {
        toast.error(data?.error ?? "Failed to send message");
        setIsLoading(false);
        return;
      }
      toast.success("Message sent successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to send message");
      setIsLoading(false);
    }
  }
  const messageRef = useRef<HTMLInputElement>(null);

  return (
    <Alert className="bg-destructive relative z-50 py-0">
      <AlertDescription className="text-primary-foreground block text-center w-full text-xs">
        {" "}
        <span>
          This is an Alpha version. If you find any discrepancy{" "}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="duration-300 hover:scale-110 transition-all inline p-0"
                variant="link"
              >
                report here
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogDescription>
                  Please share your feedback or report any issues you've encountered.
                </DialogDescription>
                <Input ref={messageRef} placeholder="Type your message here" type="text" />
                <Button
                  onClick={() => {
                    const message = messageRef.current?.value ?? "";
                    if (!message.trim()) {
                      toast.error("Please enter a message");
                      return;
                    }
                    handleMessage(message);
                  }}
                  className="mt-2 w-full duration-300 hover:scale-105 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </span>
      </AlertDescription>
    </Alert>
  );
}
