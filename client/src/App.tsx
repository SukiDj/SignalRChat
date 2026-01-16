import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Login from "./components/layout/Login";
import Sidebar from "./components/sidebar/Sidebar";
import ChatRoom from "./components/chat/ChatRoom";
import { startConnection } from "./services/signalRService";
import agent from "./api/agent";

export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [activeRoom, setActiveRoom] = useState("general");

    useEffect(() => {
        startConnection();
    }, []);

    useEffect(() => {
        if (!username) return;
        agent.chatApi.getUsers().then(setUsers);
    }, [username]);

    const selectRoom = async (target: string) => {
        if (target === "general") {
            setActiveRoom("general");
        } else {
            const roomId = await agent.chatApi.getPrivateRoomId(username!, target);
            setActiveRoom(roomId);
        }
    };

    if (!username) return <Login onLogin={setUsername} />;
    

    return (
        <Box display="flex" height="98vh">
            <Sidebar
                users={users}
                currentUser={username}
                activeRoom={activeRoom}
                onSelectRoom={selectRoom}
            />

            <ChatRoom
                username={username}
                roomId={activeRoom}
                onLogout={() => {
                    setUsername(null);
                    setActiveRoom("general");
                }}
            />
        </Box>
    );
}
