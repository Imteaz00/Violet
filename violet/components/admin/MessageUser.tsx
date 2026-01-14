"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { UserType } from "@/types";
import { toast } from "react-toastify";
import sendMessage from "@/actions/sendMessage";

export default function MessageUser({ user }: { user: UserType }) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleMessage(receiver: UserType, text: string) {
    setIsLoading(true);
    try {
      const data = await sendMessage({ receiver, text });
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="duration-300 hover:scale-110 transition-all" variant="secondary">
          Send Message to Seller
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to Seller: {user.name}</DialogTitle>
          <DialogDescription>
            <Input ref={messageRef} placeholder="Type your message here" type="text" />
            <Button
              onClick={() => {
                const input = document.getElementById("message") as HTMLInputElement;
                const message = messageRef.current?.value ?? "";
                handleMessage(user, message);
              }}
              className="mt-2 w-full duration-300 hover:scale-105 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
