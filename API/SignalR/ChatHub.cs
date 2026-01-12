using Domain;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;

        public ChatHub(ChatDbContext context)
        {
            _context = context;
        }

        public async Task JoinRoom(string roomId, string username)
        {
            var user = await GetOrCreateUser(username);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync(
                "ReceiveSystemMessage",
                $"{user.Username} joined the room"
            );
        }

        public async Task LeaveRoom(string roomId, string username)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync(
                "ReceiveSystemMessage",
                $"{username} left the room"
            );
        }

        public async Task SendMessage(string roomId, string username, string message)
        {
            var user = await GetOrCreateUser(username);

            var chatMessage = new ChatMessage
            {
                RoomId = roomId,
                Content = message,
                SenderId = user.Id,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(chatMessage);
            await _context.SaveChangesAsync();

            await Clients.Group(roomId).SendAsync(
                "ReceiveMessage",
                new
                {
                    User = user.Username,
                    Message = message,
                    SentAt = chatMessage.SentAt
                }
            );
        }

        public async Task StartPrivateChat(string user1, string user2)
        {
            var roomId = GeneratePrivateRoomId(user1, user2);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Caller.SendAsync(
                "PrivateChatStarted",
                roomId
            );
        }


        private async Task<User> GetOrCreateUser(string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                user = new User
                {
                    Username = username
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return user;
        }

        private static string GeneratePrivateRoomId(string user1, string user2)
        {
            var users = new[] { user1, user2 };
            Array.Sort(users);

            return $"private-{users[0]}-{users[1]}";
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // treba dorada
            await base.OnDisconnectedAsync(exception);
        }

    }
}