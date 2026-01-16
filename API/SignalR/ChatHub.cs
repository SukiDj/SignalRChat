using Domain;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Concurrent;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;

        private static readonly ConcurrentDictionary<string, string> Connections = new();

        public ChatHub(ChatDbContext context)
        {
            _context = context;
        }

        public async Task JoinRoom(string roomId, string username)
        {
            var user = await GetOrCreateUser(username);

            Connections[Context.ConnectionId] = username;

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            // await Clients.OthersInGroup(roomId).SendAsync(
            //     "ReceiveSystemMessage",
            //     $"{user.Username} joined the room"
            // );
        }

        public async Task LeaveRoom(string roomId)
        {
            if (Connections.TryGetValue(Context.ConnectionId, out var username))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

                // await Clients.OthersInGroup(roomId).SendAsync(
                //     "ReceiveSystemMessage",
                //     $"{username} left the room"
                // );
            }
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
                    user = user.Username,
                    message = chatMessage.Content,
                    sentAt = chatMessage.SentAt
                }
            );
        }

        public async Task GetRoomMessages(string roomId, int take = 50)
        {
            var messages = await _context.Messages
                .Where(m => m.RoomId == roomId)
                .OrderByDescending(m => m.SentAt)
                .Take(take)
                .Select(m => new
                {
                    user = m.Sender.Username,
                    message = m.Content,
                    sentAt = m.SentAt
                })
                .ToListAsync();

            messages.Reverse();

            await Clients.Caller.SendAsync("ReceiveRoomMessages", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Connections.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<User> GetOrCreateUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                user = new User { Username = username };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return user;
        }
    }
}
