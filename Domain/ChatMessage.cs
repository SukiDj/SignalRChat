namespace Domain
{
    public class ChatMessage
    {
        public Guid Id { get; set; }

        public string RoomId { get; set; }

        public Guid SenderId { get; set; }
        public User Sender { get; set; }

        public string Content { get; set; } 
        public DateTime SentAt { get; set; }
    }
}