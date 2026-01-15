import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection;

export const startConnection = async () => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5000/chatHub")
        .withAutomaticReconnect()
        .build();

    await connection.start();
};

export const joinRoom = async (roomId: string, username: string) => {
    await connection.invoke("JoinRoom", roomId, username);
};

export const leaveRoom = async (roomId: string) => {
    await connection.invoke("LeaveRoom", roomId);
};

export const sendMessage = async (roomId: string, username: string, message: string) => {
    await connection.invoke("SendMessage", roomId, username, message);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onReceiveMessage = (callback: (msg: any) => void) => {
    connection.on("ReceiveMessage", callback);
};

export const offReceiveMessage = () => {
    connection.off("ReceiveMessage");
};
