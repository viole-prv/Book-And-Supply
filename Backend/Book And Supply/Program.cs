using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;

namespace Book_And_Supply
{
    public class Program
    {
        private static void Main()
        {
            var Builder = WebApplication.CreateBuilder();

            Builder.Configuration
                .AddJsonFile("appsettings.json", false, true)
                .AddEnvironmentVariables();

            var NPGSQL = new NpgsqlDataSourceBuilder(Builder.Configuration.GetConnectionString("DefaultConnection"));
            NPGSQL.EnableDynamicJson();

            var DataSource = NPGSQL.Build();

            Builder.Services.AddDbContext<DataContext>(X => X.UseNpgsql(DataSource));

            Builder.Services
                .AddControllers(Option => Option.Filters.Add(typeof(Filter)))
                .AddNewtonsoftJson();

            Builder.Services.AddHttpContextAccessor();

            Builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(Option => Option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Builder.Configuration["JWT:Session:Key"]!)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                });

            Builder.Services.AddScoped<IdentityService>();
            Builder.Services.AddScoped<TokenService>();

            var App = Builder.Build();

            App.UseCors(builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            App.UseHttpsRedirection();

            App.UseAuthentication();

            App.UseAuthorization();

            App.MapControllers();

            App.Run();

        }
    }
}