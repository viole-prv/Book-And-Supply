using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Bag
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public required int Quantity { get; set; }

        #region User

        [JsonIgnore]
        public int UserID { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        #endregion

        #region Piece

        [JsonIgnore]
        public int PieceID { get; set; }

        [JsonIgnore]
        public Piece Piece { get; set; } = null!;

        #endregion
    }
}
