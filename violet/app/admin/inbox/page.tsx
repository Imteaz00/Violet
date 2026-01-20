import fetchAllMessages from "@/actions/fetchAllMessages";
import MessaageCard from "@/components/admin/MassageCard";
import { MessageType } from "@/types";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const messages: MessageType[] = await fetchAllMessages();

  if (!messages?.length) {
    return <div>No messages found.</div>;
  }
  return (
    <>
      {messages.map((message) => (
        <MessaageCard key={message.id} message={message} />
      ))}
    </>
  );
}
