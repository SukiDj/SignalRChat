import { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { ChatMessage } from "../types/ChatMessage";
import { getConnection } from "../services/signalRService";

interface Props {
    username: string;
    roomId: string;
}

export default function ChatRoom({ username, roomId }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Učitaj poruke iz baze (REST) kada se promeni room
    useEffect(() => {
        if (!roomId) return;

        setMessages([]); // reset poruka pri promeni sobe

        fetch(`https://localhost:5000/api/chat/rooms/${roomId}/messages`)
            .then(res => res.json())
            .then((data: ChatMessage[]) => {
                setMessages(data);
            })
            .catch(err => console.error("Failed to load messages", err));
    }, [roomId]);

    // SignalR: join room + slušaj nove poruke
    useEffect(() => {
        if (!roomId || !username) return;

        const connection = getConnection();

        connection.invoke("JoinRoom", roomId, username);

        const onReceiveMessage = (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg]);
        };

        connection.on("ReceiveMessage", onReceiveMessage);

        return () => {
            connection.invoke("LeaveRoom", roomId, username);
            connection.off("ReceiveMessage", onReceiveMessage);
        };
    }, [roomId, username]);

    // Slanje poruke (SignalR)
    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        await getConnection().invoke(
            "SendMessage",
            roomId,
            username,
            message
        );
    };

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Chat room: {roomId}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <MessageList messages={messages} />

            <MessageInput onSend={sendMessage} />
        </Box>
    );
}
