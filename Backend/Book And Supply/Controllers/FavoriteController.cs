using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController(ILogger<FavoriteController> Logger, DataContext DataContext, IdentityService IdentityService) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Entry()
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

            var T = await DataContext.Favorite
                .Where(x => x.UserID == User.ID)
                .Include(x => x.Piece).ThenInclude(x => x.Category)
                .Include(x => x.Piece).ThenInclude(x => x.Promotion)
                .Include(x => x.Piece).ThenInclude(x => x.Сritique)
                .Include(x => x.Piece).ThenInclude(x => x.Favorite)
                .OrderByDescending(x => x.ID)
                .Select(x => x.Piece)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new PieceResponse(x)));
        }

        [HttpPost]
        [Route("{PieceID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int PieceID)
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

            int T = await DataContext.Favorite
                .Where(x => x.UserID == User.ID && x.PieceID == PieceID)
                .ExecuteDeleteAsync();

            if (T == 0)
            {
                await DataContext.Favorite.AddAsync(new Favorite
                {
                    User = User,
                    Piece = Piece,
                });
            }

            await DataContext.SaveChangesAsync();

            return NoContent();
        }
    }
}