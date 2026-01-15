import { List, ListItem, ListItemText } from "@mui/material";
import type { ChatMessage } from "../types/ChatMessage";

interface Props {
    messages: ChatMessage[];
}

export default function MessageList({ messages }: Props) {
    return (
        <List sx={{ height: 400, overflowY: "auto" }}>
            {messages.map((m, i) => (
                <ListItem key={i}>
                    <ListItemText
                        primary={`${m.user}: ${m.message}`}
                        secondary={new Date(m.sentAt).toLocaleTimeString()}
                    />
                </ListItem>
            ))}
        </List>
    );
}
