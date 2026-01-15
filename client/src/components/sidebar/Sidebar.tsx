import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";

interface Props {
    users: string[];
    currentUser: string;
    activeRoom: string;
    onSelectRoom: (room: string) => void;
}

export default function Sidebar({
    users,
    currentUser,
    activeRoom,
    onSelectRoom
}: Props) {
    return (
        <Box width={300} borderRight="1px solid #ddd">
            <Typography p={2} fontWeight="bold">
                Chats
            </Typography>

            <List>
                <ListItemButton
                    selected={activeRoom === "general"}
                    onClick={() => onSelectRoom("general")}
                >
                    <ListItemText primary="General chat" />
                </ListItemButton>

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

        </Box>
    );
}
