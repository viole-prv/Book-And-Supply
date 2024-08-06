using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Promotion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required int Value { get; set; }

        [JsonIgnore]
        public ICollection<Piece> Piece { get; set; } = [];
    }
}
