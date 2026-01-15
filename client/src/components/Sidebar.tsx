import {
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Typography
} from "@mui/material";

interface Props {
    users: string[];
    currentUser: string;
    activeRoom: string;
    onSelectRoom: (roomId: string) => void;
}

export default function Sidebar({
    users,
    currentUser,
    activeRoom,
    onSelectRoom
}: Props) {
    return (
        <>
            <Typography variant="h6" sx={{ p: 2 }}>
                Chats
            </Typography>

            <List>
                <ListItemButton
                    selected={activeRoom === "general"}
                    onClick={() => onSelectRoom("general")}
                >
                    <ListItemText primary="General chat" />
                </ListItemButton>
            </List>

            <Divider />

            <Typography variant="subtitle1" sx={{ p: 2 }}>
                Users
            </Typography>

            <List>
                {users
                    .filter(u => u !== currentUser)
                    .map(user => (
                        <ListItemButton
                            key={user}
                            selected={activeRoom.includes(user)}
                            onClick={() => onSelectRoom(user)}
                        >
                            <ListItemText primary={user} />
                        </ListItemButton>
                    ))}
            </List>
        </>
    );
}
