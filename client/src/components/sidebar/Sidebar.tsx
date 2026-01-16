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
        <Box width={300} borderRight="1px solid #ddd" bgcolor={"#f5f5f5"}>
            <Typography p={2} fontWeight="bold">
                Chats
            </Typography>

            <List>
                <ListItemButton
                    selected={activeRoom === "general"}
                    onClick={() => onSelectRoom("general")}
                    sx={{
                        "&.Mui-selected": {
                            backgroundColor: "#dcf8c6de",
                            "&:hover": {
                                backgroundColor: "#cdebb0",
                            }
                        }
                    }}
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
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "#dcf8c6de",
                                    "&:hover": {
                                        backgroundColor: "#cdebb0",
                                    }
                                }
                            }}
                        >
                            <ListItemText primary={user} />
                        </ListItemButton>
                    ))}
            </List>

        </Box>
    );
}
