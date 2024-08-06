using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class CritiqueController(ILogger<CritiqueController> Logger, DataContext DataContext, IdentityService IdentityService) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо добавить рейтинг!")]
            [Range(1, 5, ErrorMessage = "Рейтинг должен быть в диапазоне от {0} до {1}.")]
            public int Star { get; set; }

            [Required(ErrorMessage = "Необходимо добавить сообщение!")]
            public string Message { get; set; } = "";
        }

        [HttpGet]
        [Route("{Tag:required}")]
        public async Task<ActionResult> Entry([FromRoute] string Tag)
        {
            var T = await DataContext.Critique
                .Include(x => x.Piece).Where(x => x.Piece.Tag == Tag)
                .Include(x => x.User)
                .OrderBy(x => x.Date)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new CritiqueResponse(x)));
        }

        [HttpPost]
        [Route("{PieceID:required}")]
        [Authorize]
        public async Task<ActionResult> Create([FromRoute] int PieceID, [FromBody] DTO _)
        {
            string? Name = IdentityService.Name();

            if (string.IsNullOrEmpty(Name))
            {
                return Unauthorized();
            }

            var User = await DataContext.User.FirstOrDefaultAsync(x => x.Login == Name);

            if (User == null)
            {
                return Forbid();
            }

            var Piece = await DataContext.Piece.FirstOrDefaultAsync(x => x.ID == PieceID);

            if (Piece == null)
            {
                return BadRequest();
            }

            await DataContext.Critique.AddAsync(new Critique
            {
                Star = _.Star,
                Message = _.Message,
                Date = DateTime.UtcNow,
                User = User,
                Piece = Piece,
            });

            await DataContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("{PieceID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int PieceID, [FromBody] DTO _)
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

            int T = await DataContext.Critique
                .Where(x => x.UserID == User.ID && x.PieceID == PieceID)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Star, x => _.Star)
                    .SetProperty(x => x.Message, x => _.Message));

            if (T == 0)
            {
                return BadRequest();
            }

            return NoContent();
        }
    }
}