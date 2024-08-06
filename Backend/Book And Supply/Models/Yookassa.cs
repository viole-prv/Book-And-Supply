using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class Yookassa
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public required string Tag { get; set; }

        [Required]
        public required string Condition { get; set; }

        [Required]
        public required DateTime Date { get; set; }

        #region User

        [JsonIgnore]
        public int UserID { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        #endregion

        [JsonIgnore]
        public ICollection<Order> Order { get; set; } = [];
    }
}
