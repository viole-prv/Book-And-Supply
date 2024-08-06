using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Book_And_Supply
{
    public class TokenService(IConfiguration Configuration)
    {
        public enum EType : byte
        {
            Session,
            Secure
        }

        private uint Life(EType Type) => uint.Parse(Configuration[$"JWT:{Type}:Life"]!);

        private string Key(EType Type) => Configuration[$"JWT:{Type}:Key"]!;

        public string Generate(string Login, EType Type)
        {
            var SecurityToken = new JwtSecurityToken(
                null,
                null,
                [
                    new(ClaimTypes.Name, Login),
                ],
                null,
                DateTime.UtcNow.AddMinutes(Life(Type)),
                new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key(Type))),
                    SecurityAlgorithms.HmacSha256
                )
            ); ;

            var SecurityTokenHandler = new JwtSecurityTokenHandler();

            return SecurityTokenHandler.WriteToken(SecurityToken);
        }

        public CookieOptions Cookie()
        {
            return new CookieOptions
            {
                Expires = DateTime.UtcNow.AddMinutes(Life(EType.Secure)),
                Secure = true,
                SameSite = SameSiteMode.None,
                HttpOnly = true
            };
        }

        public ClaimsPrincipal? Verify(string TOKEN)
        {
            var SecurityTokenHandler = new JwtSecurityTokenHandler();

            return SecurityTokenHandler.ValidateToken(
                TOKEN,
                new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Key(EType.Secure))),

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out _);
        }
    }
}
