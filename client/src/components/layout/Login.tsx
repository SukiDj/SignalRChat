import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
    onLogin: (username: string) => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState("");

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
            <Typography variant="h4" mb={2}>
                SignalR Chat
            </Typography>

            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() => onLogin(username)}
                disabled={!username}
            >
                Join
            </Button>
        </Box>
    );
}
