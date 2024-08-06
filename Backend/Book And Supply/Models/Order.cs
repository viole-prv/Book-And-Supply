using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public required decimal Price { get; set; }

        [Required]
        public required int Quantity { get; set; }

        #region Piece

        [JsonIgnore]
        public int PieceID { get; set; }

        [JsonIgnore]
        public Piece Piece { get; set; } = null!;

        #endregion

        #region Yookassa

        [JsonIgnore]
        public int YookassaID { get; set; }

        [JsonIgnore]
        public Yookassa Yookassa { get; set; } = null!;

        #endregion
    }
}
