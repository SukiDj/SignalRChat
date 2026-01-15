import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { joinRoom, leaveRoom, sendMessage, onReceiveMessage, offReceiveMessage } from "../../services/signalRService";
import agent from "../../api/agent";
import type { ChatMessage } from "../../models/ChatMessage";

interface Props {
    username: string;
    roomId: string;
    onLogout: () => void;
}

export default function ChatRoom({ username, roomId, onLogout }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!roomId) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([]);

        agent.chatApi.getRoomMessages(roomId).then(setMessages);

        joinRoom(roomId, username);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReceiveMessage((msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            leaveRoom(roomId);
            offReceiveMessage();
        };
    }, [roomId, username]);

    const getChatTitle = () => {
        if (roomId === "general") return "General chat";

        if (roomId.startsWith("private-")) {
            const parts = roomId.replace("private-", "").split("-");
            return parts.find(p => p !== username) ?? roomId;
        }

        return roomId;
    };


    return (
        <Box flex={1} display="flex" flexDirection="column">
            <Box
                p={2}
                borderBottom="1px solid #ddd"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography fontWeight="bold">
                    {getChatTitle()}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={onLogout}
                >
                    Logout
                </Button>
            </Box>


            <MessageList messages={messages} currentUser={username} />

            <MessageInput
                onSend={(msg) => sendMessage(roomId, username, msg)}
            />
        </Box>
    );
}
