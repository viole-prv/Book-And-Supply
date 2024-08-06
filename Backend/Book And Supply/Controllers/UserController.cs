using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(ILogger<UserController> Logger, DataContext DataContext, IdentityService IdentityService, TokenService TokenService) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо ввести имя!")]
            public string FirstName { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести фамилию!")]
            public string LastName { get; set; } = "";

            [Required(ErrorMessage = "Необходимо загрузить фотографию!")]
            public string Picture { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести день!")]
            [RegularExpression(@"^(0[1-9]|[1-2][0-9]|3[0-1])$", ErrorMessage = "День должен быть указан в формате от 01 до 31.")]
            public string Day { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести месяц!")]
            [RegularExpression(@"^(0[1-9]|1[0-2])$", ErrorMessage = "Месяц должен быть указан в формате от 01 до 12.")]
            public string Month { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести год!")]
            [RegularExpression(@"^\d{4}$", ErrorMessage = "Год должен быть указан в формате четырех цифр (например, 1980).")]
            public string Year { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести номер телефона!")]
            [RegularExpression(@"^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$", ErrorMessage = "Номер телефона должен быть в формате: +7 (XXX) XXX-XX-XX.")]
            public string PhoneNumber { get; set; } = "";

            [Required(ErrorMessage = "Необходимо ввести электронную почту!")]
            [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Неверный формат электронной почты.")]
            public string EMail { get; set; } = "";
        }

        [HttpGet]
        [Route("profile")]
        [Authorize]
        public async Task<ActionResult> Entry()
        {
            string? Name = IdentityService.Name();

            if (string.IsNullOrEmpty(Name))
            {
                return Unauthorized();
            }

            var T = await DataContext.User
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Login == Name);

            if (T == null)
            {
                return Forbid();
            }

            return Ok(new UserResponse(T));
        }

        [HttpPut]
        [Route("profile")]
        [Authorize]
        public async Task<ActionResult> Update([FromBody] DTO _)
        {
            string? Name = IdentityService.Name();

            if (string.IsNullOrEmpty(Name))
            {
                return Unauthorized();
            }

            var User = await DataContext.User
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Login == Name);

            if (User == null)
            {
                return Forbid();
            }

            int T = await DataContext.User
                .Where(x => x.ID == User.ID)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.FirstName, x => _.FirstName)
                    .SetProperty(x => x.LastName, x => _.LastName)
                    .SetProperty(x => x.Picture, x => _.Picture)
                    .SetProperty(x => x.Day, x => _.Day)
                    .SetProperty(x => x.Month, x => _.Month)
                    .SetProperty(x => x.Year, x => _.Year)
                    .SetProperty(x => x.PhoneNumber, x => _.PhoneNumber)
                    .SetProperty(x => x.EMail, x => _.EMail));

            if (T == 0)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpPost]
        [Route("auth/register")]
        public async Task<ActionResult> Register([FromQuery] UserRequest User, [FromBody] DTO _)
        {
            bool Any = await DataContext.User
                .AsNoTracking()
                .AnyAsync(x => x.Login == User.Login);

            if (Any)
            {
                ModelState.AddModelError(nameof(User.Login), "Это имя пользователя уже занято!");

                return Conflict(ModelState);
            }

            User T = new()
            {
                Login = User.Login,
                Password = BCrypt.Net.BCrypt.HashPassword(User.Password),

                FirstName = _.FirstName,
                LastName = _.LastName,
                Picture = _.Picture,

                Day = _.Day,
                Month = _.Month,
                Year = _.Year,

                PhoneNumber = _.PhoneNumber,
                EMail = _.EMail,

                SessionToken = TokenService.Generate(User.Login, TokenService.EType.Session),
                SecureToken = TokenService.Generate(User.Login, TokenService.EType.Secure)
            };

            await DataContext.User.AddAsync(T);

            await DataContext.SaveChangesAsync();

            HttpContext.Response.Cookies.Append("secure-token", T.SecureToken, TokenService.Cookie());

            return Ok(new UserResponse(T));
        }

        [HttpPost]
        [Route("auth/login")]
        public async Task<ActionResult> Login([FromBody] UserRequest User)
        {
            var T = await DataContext.User.FirstOrDefaultAsync(x => x.Login == User.Login);

            if (T == null)
            {
                ModelState.AddModelError(nameof(User.Login), "Не удалось найти ваш аккаунт.");

                return BadRequest(ModelState);
            }

            if (!BCrypt.Net.BCrypt.Verify(User.Password, T.Password))
            {
                ModelState.AddModelError(nameof(User.Password), "Пароль неверный.");

                return BadRequest(ModelState);
            }

            T.SessionToken = TokenService.Generate(T.Login, TokenService.EType.Session);
            T.SecureToken = TokenService.Generate(T.Login, TokenService.EType.Secure);

            await DataContext.SaveChangesAsync();

            HttpContext.Response.Cookies.Append("secure-token", T.SecureToken, TokenService.Cookie());

            return Ok(new UserResponse(T));
        }

        [HttpPost]
        [Route("auth/secure")]
        public async Task<ActionResult> Secure()
        {
            string? SecureToken = Request.Cookies["secure-token"];

            if (string.IsNullOrEmpty(SecureToken))
            {
                return Forbid();
            }

            var User = TokenService.Verify(SecureToken);

            if (User == null || User.Identity == null || string.IsNullOrEmpty(User.Identity.Name))
            {
                return Forbid();
            }

            var T = await DataContext.User.FirstOrDefaultAsync(x => x.Login == User.Identity.Name);

            if (T == null || T.SecureToken != SecureToken)
            {
                return Forbid();
            }

            T.SessionToken = TokenService.Generate(T.Login, TokenService.EType.Session);
            T.SecureToken = TokenService.Generate(T.Login, TokenService.EType.Secure);

            await DataContext.SaveChangesAsync();

            HttpContext.Response.Cookies.Append("secure-token", T.SecureToken, TokenService.Cookie());

            return Ok(new { T.SessionToken });
        }

        [HttpPost]
        [Route("auth/logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            string? Name = IdentityService.Name();

            if (string.IsNullOrEmpty(Name))
            {
                return Unauthorized();
            }

            var T = await DataContext.User.FirstOrDefaultAsync(x => x.Login == Name);

            if (T == null)
            {
                return Forbid();
            }

            T.SessionToken = null;
            T.SecureToken = null;

            await DataContext.SaveChangesAsync();

            return NoContent();
        }
    }
}