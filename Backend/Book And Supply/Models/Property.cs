using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    public class Property
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required List<string> Array { get; set; }
    }
}
