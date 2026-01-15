import axios from "axios";
import type { ChatMessage } from "../models/ChatMessage";

axios.defaults.baseURL = "https://localhost:5000/api";

const responseBody = <T>(response: { data: T }) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
};

const chatApi = {
    getUsers: (): Promise<string[]> => requests.get<string[]>("/chat/users"),
    getPrivateRoomId: (user1: string, user2: string): Promise<string> => requests.get<string>(`/chat/private-room?user1=${user1}&user2=${user2}`),
    getRoomMessages: (roomId: string): Promise<ChatMessage[]> => requests.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`)
};

const agent = {
    chatApi
}

export default agent;
