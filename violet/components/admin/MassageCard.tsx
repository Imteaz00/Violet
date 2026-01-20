import { MessageType } from "@/types";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Badge } from "../ui/badge";
import { formatDateTime } from "@/lib/formatters";

export default function MessageCard({ message }: { message: MessageType }) {
  return (
    <Item variant="outline" className="bg-card relative">
      <ItemContent>
        <ItemTitle className="font-semibold text-lg">
          <span>From: {message.senderUser?.name || "Unknown"}</span>
          {!message.seen && <Badge className="ml-2">New</Badge>}
          <span className="text-muted-foreground text-sm">
            {formatDateTime(new Date(message.createdAt))}
          </span>
        </ItemTitle>
        <ItemDescription>{message.text}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
