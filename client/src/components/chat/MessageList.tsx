import { Box, Typography } from "@mui/material";
import type { ChatMessage } from "../../models/ChatMessage";

interface Props {
    messages: ChatMessage[];
    currentUser: string;
}

export default function MessageList({ messages, currentUser }: Props) {
    return (
        <Box flex={1} p={2} overflow="auto" bgcolor={"#fafafa"}>
            {messages.map((m, i) => (
                <Box
                    key={i}
                    display="flex"
                    justifyContent={m.user === currentUser ? "flex-end" : "flex-start"}
                    mb={1}
                >
                    <Box
                        bgcolor={m.user === currentUser ? "#DCF8C6" : "#ebebeb"}
                        p={1.5}
                        borderRadius={2}
                        maxWidth="70%"
                    >
                        <Typography variant="body2">
                            <strong>{m.user}</strong>
                        </Typography>
                        <Typography>{m.message}</Typography>
                        <Typography variant="caption" color="gray">
                            {new Date(m.sentAt).toLocaleTimeString()}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
