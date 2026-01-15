import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

interface Props {
    onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
    const [message, setMessage] = useState("");

    const send = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage("");
    };

    return (
        <Box display="flex" p={2} borderTop="1px solid #ddd">
            <TextField
                fullWidth
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <IconButton color="primary" onClick={send}>
                <SendIcon />
            </IconButton>
        </Box>
    );
}
