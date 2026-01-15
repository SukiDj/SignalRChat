import {
    Container,
    Typography,
    Grid,
    Paper
} from "@mui/material";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import Sidebar from "./components/Sidebar";
import { startConnection } from "./services/signalRService";
import agent from "./api/agent";

export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [activeRoom, setActiveRoom] = useState<string>("general");

    useEffect(() => {
        startConnection();
    }, []);

    useEffect(() => {
        if (!username) return;

        agent.chatApi.getUsers().then(setUsers);
    }, [username]);

    const handleSelectRoom = async (target: string) => {
        if (target === "general") {
            setActiveRoom("general");
            return;
        }

        // private chat
        const roomId = await agent.chatApi.getPrivateRoomId(username!, target);
        setActiveRoom(roomId);
    };

    if (!username) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    SignalR Chat
                </Typography>
                <Login onLogin={setUsername} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                SignalR Chat
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper sx={{ height: "80vh" }}>
                        <Sidebar
                            users={users}
                            currentUser={username}
                            activeRoom={activeRoom}
                            onSelectRoom={handleSelectRoom}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={8}>
                    <Paper sx={{ p: 2, height: "80vh" }}>
                        <ChatRoom
                            username={username}
                            roomId={activeRoom}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
