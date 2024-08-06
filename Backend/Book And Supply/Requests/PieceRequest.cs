using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    public class PieceRequest
    {
        [Required(ErrorMessage = "Необходимо добавить текущую страницу!")]
        [Range(1, int.MaxValue, ErrorMessage = "Текущая страница должна находиться в пределах от {1} до {2}.")]
        public int CurrentPage { get; set; }

        [Required(ErrorMessage = "Необходимо добавить размер страницы!")]
        [Range(1, int.MaxValue, ErrorMessage = "Размер страницы должен быть в пределе от {1} до {2}.")]
        public int PageSize { get; set; }

        [Required(ErrorMessage = "Необходимо указать начальную цену!")]
        [Range(1, int.MaxValue, ErrorMessage = "Начальная цена должна быть больше нуля.")]
        public int FromPrice { get; set; }

        [Required(ErrorMessage = "Необходимо указать конечную цену!")]
        [Range(1, int.MaxValue, ErrorMessage = "Конечная цена должна быть больше нуля.")]
        public int ToPrice { get; set; }

        [Required(ErrorMessage = "Необходимо указать сортировку!")]
        [Range(1, 5, ErrorMessage = "Сортировка должна быть между 1 и 5.")]
        public int Sort { get; set; } = 1;

        [Required(ErrorMessage = "Необходимо указать свойство!")]
        public Dictionary<string, List<string>> Property { get; set; } = [];
    }
}
