using Microsoft.EntityFrameworkCore;

namespace Book_And_Supply
{
    public class DataContext : DbContext
    {
        public DbSet<Bag> Bag { get; set; }

        public DbSet<Category> Category { get; set; }

        public DbSet<Critique> Critique { get; set; }

        public DbSet<Favorite> Favorite { get; set; }

        public DbSet<Order> Order { get; set; }

        public DbSet<Piece> Piece { get; set; }

        public DbSet<Promotion> Promotion { get; set; }

        public DbSet<User> User { get; set; }

        public DbSet<Yookassa> Yookassa { get; set; }

        protected override void OnModelCreating(ModelBuilder Builder)
        {
            #region Bag

            Builder.Entity<Bag>()
                .HasOne(x => x.User)
                .WithMany(x => x.Bag)
                .HasForeignKey(x => x.UserID)
                .IsRequired();

            Builder.Entity<Bag>()
                .HasOne(x => x.Piece)
                .WithMany(x => x.Bag)
                .HasForeignKey(x => x.PieceID)
                .IsRequired();

            #endregion

            #region Favorite

            Builder.Entity<Favorite>()
                .HasOne(x => x.User)
                .WithMany(x => x.Favorite)
                .HasForeignKey(x => x.UserID)
                .IsRequired();

            Builder.Entity<Favorite>()
                .HasOne(x => x.Piece)
                .WithMany(x => x.Favorite)
                .HasForeignKey(x => x.PieceID)
                .IsRequired();

            #endregion

            #region Order

            Builder.Entity<Order>()
                .HasOne(x => x.Piece)
                .WithMany(x => x.Order)
                .HasForeignKey(x => x.PieceID)
                .IsRequired();

            Builder.Entity<Order>()
                .HasOne(x => x.Yookassa)
                .WithMany(x => x.Order)
                .HasForeignKey(x => x.YookassaID)
                .IsRequired();

            #endregion

            #region Piece

            Builder.Entity<Piece>()
                .HasOne(x => x.Category)
                .WithMany(x => x.Piece)
                .HasForeignKey(x => x.CategoryID)
                .IsRequired(false);

            Builder.Entity<Piece>()
                .HasOne(x => x.Promotion)
                .WithMany(x => x.Piece)
                .HasForeignKey(x => x.PromotionID)
                .IsRequired(false);

            #endregion

            #region Yookassa

            Builder.Entity<Yookassa>()
                .HasOne(x => x.User)
                .WithMany(x => x.Yookassa)
                .HasForeignKey(x => x.UserID)
                .IsRequired();

            #endregion

            #region Сritique

            Builder.Entity<Critique>()
                .HasOne(x => x.User)
                .WithMany(x => x.Сritique)
                .HasForeignKey(x => x.UserID)
                .IsRequired();

            Builder.Entity<Critique>()
                .HasOne(x => x.Piece)
                .WithMany(x => x.Сritique)
                .HasForeignKey(x => x.PieceID)
                .IsRequired();

            #endregion
        }

        public DataContext(DbContextOptions<DataContext> X) : base(X)
        {
            Database.EnsureCreated();
        }
    }
}
