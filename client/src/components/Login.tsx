import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";

interface Props {
    onLogin: (username: string) => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState("");

    return (
        <Box display="flex" gap={2}>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={() => onLogin(username)}
                disabled={!username}
            >
                Join
            </Button>
        </Box>
    );
}
