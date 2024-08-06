using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class BagController(ILogger<BagController> Logger, DataContext DataContext, IdentityService IdentityService) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо добавить количество!")]
            public int Quantity { get; set; }
        }

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

            var T = await DataContext.Bag
                .Where(x => x.UserID == User.ID)
                .Include(x => x.Piece).ThenInclude(x => x.Category)
                .Include(x => x.Piece).ThenInclude(x => x.Promotion)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new BagResponse(x)));
        }

        [HttpPost]
        [Route("{PieceID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int PieceID, [FromBody] DTO _)
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

            if (_.Quantity == 0)
            {
                int T = await DataContext.Bag
                    .Where(x => x.UserID == User.ID && x.PieceID == PieceID)
                    .ExecuteDeleteAsync();

                if (T == 0)
                {
                    return BadRequest();
                }
            }
            else
            {
                if (Piece.Count == 0)
                {
                    return BadRequest();
                }

                int T = await DataContext.Bag
                    .Where(x => x.UserID == User.ID && x.PieceID == PieceID)
                    .ExecuteUpdateAsync(x => x.SetProperty(x => x.Quantity, x => _.Quantity));

                if (T == 0)
                {
                    await DataContext.Bag.AddAsync(new Bag
                    {
                        Quantity = _.Quantity,
                        User = User,
                        Piece = Piece,
                    });

                    await DataContext.SaveChangesAsync();
                }
            }

            return NoContent();
        }
    }
}