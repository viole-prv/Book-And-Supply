using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Piece
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public required string Tag { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [Column(TypeName = "jsonb")]
        public required List<string> Picture { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public required decimal Price { get; set; }

        [Required]
        public required int Count { get; set; }

        [Required]
        [Column(TypeName = "jsonb")]
        public required List<Property> Property { get; set; }

        [Required]
        public required string Description { get; set; }

        #region Category

        [JsonIgnore]
        public int? CategoryID { get; set; }

        [JsonIgnore]
        public Category Category { get; set; } = null!;

        #endregion

        #region Promotion

        [JsonIgnore]
        public int? PromotionID { get; set; }

        [JsonIgnore]
        public Promotion Promotion { get; set; } = null!;

        #endregion

        [JsonIgnore]
        public ICollection<Bag> Bag { get; set; } = [];

        [JsonIgnore]
        public ICollection<Order> Order { get; set; } = [];

        [JsonIgnore]
        public ICollection<Critique> Сritique { get; set; } = [];

        [JsonIgnore]
        public ICollection<Favorite> Favorite { get; set; } = [];
    }
}
