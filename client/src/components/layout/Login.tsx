import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
    onLogin: (username: string) => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState("");

    return (
        <Box sx={{ p: 3, width: 350, alignItems: "center", margin: "auto", marginTop: "20vh", boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" mb={2}>
                SignalR Chat
            </Typography>

            <TextField
                color="success"
                label="Username"
                fullWidth
                sx={{ mb: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onLogin(username)}
            />

            <Button
                sx={{ mt: 2, bgcolor: "#47d359" }}
                variant="contained"
                fullWidth
                onClick={() => onLogin(username)}
                disabled={!username}
            >
                Join
            </Button>
        </Box>
    );
}
