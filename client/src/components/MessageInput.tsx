import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";

interface Props {
    onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
    const [message, setMessage] = useState("");

    const send = () => {
        if (!message) return;
        onSend(message);
        setMessage("");
    };

    return (
        <Box display="flex" gap={2} mt={2}>
            <TextField
                fullWidth
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button variant="contained" onClick={send}>
                Send
            </Button>
        </Box>
    );
}
