using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilterController(ILogger<FilterController> Logger, DataContext DataContext) : ControllerBase
    {
        [HttpGet]
        [Route("range")]
        public async Task<ActionResult> Range()
        {
            var T = await DataContext.Piece
                .Include(x => x.Promotion)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null || T.Count == 0)
            {
                return BadRequest();
            }

            var N = T
                .Select(x => new PieceResponse.IPrice(x.Price, x.Promotion))
                .Select(x => x.Current)
                .ToList();

            return Ok(new RangeResponse(N));
        }


        [HttpGet]
        [Route("sort")]
        public ActionResult Sort()
        {
            string[] T = [
                "Популярные",
                "Сначала дешевле",
                "Сначала дороже",
                "По скидке (%)",
                "Новинки"
            ];

            return Ok(new { Value = 1, List = T.Select((x, i) => new { ID = i + 1, Name = x }) });
        }
    }
}