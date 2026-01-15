import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startConnection = async () => {
    if (connection) return;

    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5000/chatHub")
        .withAutomaticReconnect()
        .build();

    await connection.start();
};

export const getConnection = () => {
    if (!connection) {
        throw new Error("SignalR connection not started");
    }
    return connection;
};

// import * as signalR from "@microsoft/signalr";

// let connection: signalR.HubConnection;

// export const startConnection = async () => {
//     connection = new signalR.HubConnectionBuilder()
//         .withUrl("https://localhost:5001/chat")
//         .withAutomaticReconnect()
//         .build();

//     await connection.start();
// };

// export const joinRoom = (roomId: string) =>
//     connection.invoke("JoinRoom", roomId);

// export const leaveRoom = (roomId: string) =>
//     connection.invoke("LeaveRoom", roomId);

// export const sendMessage = (roomId: string, message: string) =>
//     connection.invoke("SendMessage", roomId, message);

// export const onReceiveMessage = (callback: (msg: any) => void) =>
//     connection.on("ReceiveMessage", callback);
