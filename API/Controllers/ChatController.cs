using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public ChatController(ChatDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => u.Username)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("private-room")]
        public IActionResult GetPrivateRoomId(
            [FromQuery] string user1,
            [FromQuery] string user2)
        {
            var users = new[] { user1, user2 };
            Array.Sort(users);

            var roomId = $"private-{users[0]}-{users[1]}";

            return Ok(roomId);
        }

        [HttpGet("rooms/{roomId}/messages")]
        public async Task<IActionResult> GetRoomMessages(string roomId, [FromQuery] int take = 50)
        {
            var messages = await _context.Messages
                .Where(m => m.RoomId == roomId)
                .OrderBy(m => m.SentAt)
                .Take(take)
                .Select(m => new
                {
                    user = m.Sender.Username,
                    message = m.Content,
                    sentAt = m.SentAt
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}
