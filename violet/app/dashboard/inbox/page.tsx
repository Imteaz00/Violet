import fetchMessages from "@/actions/fetchMessages";
import MessaageCard from "@/components/dashboard/MessageCard";
import { MessageType } from "@/types";

export default async function InboxPage() {
  const messages: MessageType[] = await fetchMessages();

  if (!messages?.length) {
    return <div>No messages found.</div>;
  }
  return messages.map((message) => <MessaageCard key={message.id} message={message} />);
}
