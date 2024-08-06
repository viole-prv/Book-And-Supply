﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Book_And_Supply;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Book_And_Supply.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Book_And_Supply.Bag", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<int>("PieceID")
                        .HasColumnType("integer");

                    b.Property<int>("Quantity")
                        .HasColumnType("integer");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.HasIndex("PieceID");

                    b.HasIndex("UserID");

                    b.ToTable("Bag");
                });

            modelBuilder.Entity("Book_And_Supply.Category", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<List<Property>>("Property")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<string>("Tag")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.ToTable("Category");
                });

            modelBuilder.Entity("Book_And_Supply.Critique", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PieceID")
                        .HasColumnType("integer");

                    b.Property<int>("Star")
                        .HasColumnType("integer");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.HasIndex("PieceID");

                    b.HasIndex("UserID");

                    b.ToTable("Critique");
                });

            modelBuilder.Entity("Book_And_Supply.Favorite", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<int>("PieceID")
                        .HasColumnType("integer");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.HasIndex("PieceID");

                    b.HasIndex("UserID");

                    b.ToTable("Favorite");
                });

            modelBuilder.Entity("Book_And_Supply.Order", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<int>("PieceID")
                        .HasColumnType("integer");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("Quantity")
                        .HasColumnType("integer");

                    b.Property<int>("YookassaID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.HasIndex("PieceID");

                    b.HasIndex("YookassaID");

                    b.ToTable("Order");
                });

            modelBuilder.Entity("Book_And_Supply.Piece", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<int?>("CategoryID")
                        .HasColumnType("integer");

                    b.Property<int>("Count")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<List<string>>("Picture")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int?>("PromotionID")
                        .HasColumnType("integer");

                    b.Property<List<Property>>("Property")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<string>("Tag")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.HasIndex("CategoryID");

                    b.HasIndex("PromotionID");

                    b.ToTable("Piece");
                });

            modelBuilder.Entity("Book_And_Supply.Promotion", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Value")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.ToTable("Promotion");
                });

            modelBuilder.Entity("Book_And_Supply.User", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Day")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("EMail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Month")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Picture")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SecureToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SessionToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Year")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.ToTable("User");
                });

            modelBuilder.Entity("Book_And_Supply.Yookassa", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Condition")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Tag")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.HasIndex("UserID");

                    b.ToTable("Yookassa");
                });

            modelBuilder.Entity("Book_And_Supply.Bag", b =>
                {
                    b.HasOne("Book_And_Supply.Piece", "Piece")
                        .WithMany("Bag")
                        .HasForeignKey("PieceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Book_And_Supply.User", "User")
                        .WithMany("Bag")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Piece");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Book_And_Supply.Critique", b =>
                {
                    b.HasOne("Book_And_Supply.Piece", "Piece")
                        .WithMany("Сritique")
                        .HasForeignKey("PieceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Book_And_Supply.User", "User")
                        .WithMany("Сritique")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Piece");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Book_And_Supply.Favorite", b =>
                {
                    b.HasOne("Book_And_Supply.Piece", "Piece")
                        .WithMany("Favorite")
                        .HasForeignKey("PieceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Book_And_Supply.User", "User")
                        .WithMany("Favorite")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Piece");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Book_And_Supply.Order", b =>
                {
                    b.HasOne("Book_And_Supply.Piece", "Piece")
                        .WithMany("Order")
                        .HasForeignKey("PieceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Book_And_Supply.Yookassa", "Yookassa")
                        .WithMany("Order")
                        .HasForeignKey("YookassaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Piece");

                    b.Navigation("Yookassa");
                });

            modelBuilder.Entity("Book_And_Supply.Piece", b =>
                {
                    b.HasOne("Book_And_Supply.Category", "Category")
                        .WithMany("Piece")
                        .HasForeignKey("CategoryID");

                    b.HasOne("Book_And_Supply.Promotion", "Promotion")
                        .WithMany("Piece")
                        .HasForeignKey("PromotionID");

                    b.Navigation("Category");

                    b.Navigation("Promotion");
                });

            modelBuilder.Entity("Book_And_Supply.Yookassa", b =>
                {
                    b.HasOne("Book_And_Supply.User", "User")
                        .WithMany("Yookassa")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Book_And_Supply.Category", b =>
                {
                    b.Navigation("Piece");
                });

            modelBuilder.Entity("Book_And_Supply.Piece", b =>
                {
                    b.Navigation("Bag");

                    b.Navigation("Favorite");

                    b.Navigation("Order");

                    b.Navigation("Сritique");
                });

            modelBuilder.Entity("Book_And_Supply.Promotion", b =>
                {
                    b.Navigation("Piece");
                });

            modelBuilder.Entity("Book_And_Supply.User", b =>
                {
                    b.Navigation("Bag");

                    b.Navigation("Favorite");

                    b.Navigation("Yookassa");

                    b.Navigation("Сritique");
                });

            modelBuilder.Entity("Book_And_Supply.Yookassa", b =>
                {
                    b.Navigation("Order");
                });
#pragma warning restore 612, 618
        }
    }
}