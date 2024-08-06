using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Book_And_Supply
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public required string Login { get; set; }    

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string FirstName { get; set; }  
        
        [Required]
        public required string LastName { get; set; }   

        [Required]
        public required string Picture { get; set; }    
        
        [Required]
        public required string Day { get; set; }

        [Required]
        public required string Month { get; set; }

        [Required]
        public required string Year { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        [Required]
        public required string EMail { get; set; }

        [Required]
        public required string? SessionToken { get; set; }

        [Required]
        public required string? SecureToken { get; set; }

        [JsonIgnore]
        public ICollection<Bag> Bag { get; set; } = [];
        
        [JsonIgnore]
        public ICollection<Critique> Сritique { get; set; } = [];

        [JsonIgnore]
        public ICollection<Favorite> Favorite { get; set; } = [];

        [JsonIgnore]
        public ICollection<Yookassa> Yookassa { get; set; } = [];
    }
}
