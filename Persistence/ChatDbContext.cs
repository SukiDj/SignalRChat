using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options)
        : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<ChatMessage> Messages => Set<ChatMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username)
                      .IsRequired()
                      .HasMaxLength(50);
            });

            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.RoomId)
                      .IsRequired();

                entity.Property(m => m.Content)
                      .IsRequired()
                      .HasMaxLength(1000);

                entity.Property(m => m.SentAt)
                      .IsRequired();

                entity.HasOne(m => m.Sender)
                      .WithMany()
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}