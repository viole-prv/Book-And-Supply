using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    public class UserRequest
    {
        [Required(ErrorMessage = "Необходимо добавить имя учетной записи!")]
        [MinLength(4, ErrorMessage = "Слишком короткое имя учетной записи!")]
        public string Login { get; set; } = "";

        [Required(ErrorMessage = "Необходимо ввести пароль!")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "Пароль должен содержать как минимум одну строчную букву, одну заглавную букву и одну цифру.")]
        [MinLength(12, ErrorMessage = "Пароль должен содержать не менее {1} символов, включать как буквы верхнего, так и нижнего регистров, а также цифры.")]
        public string Password { get; set; } = "";
    }
}
