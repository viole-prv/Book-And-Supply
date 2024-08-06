using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Category
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
        public required List<Property> Property { get; set; }

        [JsonIgnore]
        public ICollection<Piece> Piece { get; set; } = [];
    }
}
