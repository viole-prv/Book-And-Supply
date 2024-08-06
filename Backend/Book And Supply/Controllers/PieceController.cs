using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class PieceController(ILogger<PieceController> Logger, DataContext DataContext) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо добавить метку!")]
            public string Tag { get; set; } = "";

            [Required(ErrorMessage = "Необходимо добавить название!")]
            public string Name { get; set; } = "";

            [Required(ErrorMessage = "Необходимо добавить изображение!")]
            public List<string> Picture { get; set; } = [];

            [Required(ErrorMessage = "Необходимо добавить цену!")]
            [Range(1, (double)decimal.MaxValue, ErrorMessage = "Цена должна быть больше нуля!")]
            public decimal Price { get; set; }

            [Required(ErrorMessage = "Необходимо добавить свойство!")]
            public List<Property> Property { get; set; } = [];

            public string Description { get; set; } = "";

            public int Count { get; set; }

            public int? Category { get; set; }

            public int? Promotion { get; set; }
        }

        [HttpPost]
        [Route("{Tag:required}")]
        public async Task<ActionResult> Entry([FromRoute] string Tag, [FromBody] PieceRequest _)
        {
            var T = await DataContext.Piece
                .Include(x => x.Category).Where(x => x.Category.Tag == Tag)
                .Include(x => x.Promotion)
                .Include(x => x.Сritique)
                .Include(x => x.Favorite)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            var N = T
                .Select(x => new PieceResponse(x))
                .ToList();

            if (_.Property.Count > 0)
            {
                N = N
                    .Where(Piece =>
                        _.Property.All(Pair =>
                            Piece.Property.Any(Property =>
                                Property.Name == Pair.Key &&
                                Property.Array.Intersect(Pair.Value).Any()
                            )
                        )
                    )
                    .ToList();
            }

            switch (_.Sort)
            {
                case 1:
                    N = [.. N.OrderByDescending(x => x.Critique.Star)];

                    break;
                case 2:
                    N = [.. N.OrderBy(x => x.Price.Current)];

                    break;
                case 3:
                    N = [.. N.OrderByDescending(x => x.Price.Current)];

                    break;
                case 4:
                    N = [.. N.OrderBy(x => x.Price.Rate)];

                    break;
                case 5:
                    N = [.. N.OrderByDescending(x => x.ID)];

                    break;
            }

            N.RemoveAll(x => x.Price.Current < _.FromPrice || x.Price.Current > _.ToPrice);

            return Ok(new { N.Count, List = N.Skip((_.CurrentPage - 1) * _.PageSize).Take(_.PageSize) });
        }

        [HttpGet]
        [Route("{Tag:required}")]
        public async Task<ActionResult> ByTag([FromRoute] string Tag)
        {
            var T = await DataContext.Piece
                .Where(x => x.Tag == Tag)
                .Include(x => x.Category)
                .Include(x => x.Promotion)
                .Include(x => x.Сritique)
                .Include(x => x.Favorite)
                .AsSplitQuery()
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(new PieceResponse(T));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] DTO _)
        {
            bool Any = await DataContext.Piece
                .AsNoTracking()
                .AnyAsync(x => x.Name == _.Name);

            if (Any)
            {
                ModelState.AddModelError(nameof(_.Name), "Это название уже занято!");

                return Conflict(ModelState);
            }

            Piece T = new()
            {
                Tag = _.Tag,
                Name = _.Name,
                Picture = _.Picture,
                Price = _.Price,
                Property = _.Property,
                Description = _.Description,
                Count = _.Count,
            };

            if (_.Category.HasValue)
            {
                var Category = await DataContext.Category.FirstOrDefaultAsync(x => x.ID == _.Category);

                if (Category == null)
                {
                    return BadRequest();
                }

                T.Category = Category;
            }

            if (_.Promotion.HasValue)
            {
                var Promotion = await DataContext.Promotion.FirstOrDefaultAsync(x => x.ID == _.Promotion);

                if (Promotion == null)
                {
                    return BadRequest();
                }

                T.Promotion = Promotion;
            }

            await DataContext.Piece.AddAsync(T);

            await DataContext.SaveChangesAsync();

            return Ok(new PieceResponse(T));
        }

        [HttpPut]
        [Route("{PieceID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int PieceID, [FromBody] DTO _)
        {
            int T = await DataContext.Piece
                .Where(x => x.ID == PieceID)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Tag, x => _.Tag)
                    .SetProperty(x => x.Name, x => _.Name)
                    .SetProperty(x => x.Picture, x => _.Picture)
                    .SetProperty(x => x.Price, x => _.Price)
                    .SetProperty(x => x.Count, x => _.Count)
                    .SetProperty(x => x.Property, x => _.Property)
                    .SetProperty(x => x.Description, x => _.Description)
                    .SetProperty(x => x.CategoryID, x => _.Category)
                    .SetProperty(x => x.PromotionID, x => _.Promotion));

            if (T == 0)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpGet]
        [Route("similar/{Tag:required}")]
        public async Task<ActionResult> Similar([FromRoute] string Tag)
        {
            var _ = await DataContext.Piece
                .Include(x => x.Category)
                .Include(x => x.Promotion)
                .Include(x => x.Сritique)
                .Include(x => x.Favorite)
                .OrderBy(x => x.ID)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (_ == null)
            {
                return BadRequest();
            }

            var T = _.FirstOrDefault(x => x.Tag == Tag);

            if (T == null)
            {
                return BadRequest();
            }

            var X = T.Property.FirstOrDefault(x => x.Name == "Франшиза");

            if (X == null)
            {
                return BadRequest();
            }

            var N = _
                .Where(Piece =>
                    Piece.Property.Any(Property =>
                        Property.Name == "Франшиза" &&
                        Property.Array.SequenceEqual(X.Array)
                    )
                )
                .ToList();

            N.RemoveAll(x => x.Name == T.Name);

            return Ok(N.Take(16).Select(x => new PieceResponse(x)));
        }

        [HttpGet]
        [Route("banner")]
        public async Task<ActionResult> Banner()
        {
            var T = await DataContext.Piece
                .Include(x => x.Category)
                .Include(x => x.Promotion)
                .Include(x => x.Сritique)
                .Include(x => x.Favorite)
                .OrderBy(x => x.ID)
                .GroupBy(x => x.Category.Tag)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new { Tag = x.Key, List = x.Take(16).Select(x => new PieceResponse(x)).OrderByDescending(x => x.Critique.Star) }));
        }

        [HttpGet]
        [Route("look")]
        public async Task<ActionResult> Look([FromQuery] string Query)
        {
            string _ = Query.ToLower();

#pragma warning disable CA1862 // Use the 'StringComparison' method overloads to perform case-insensitive string comparisons

            var T = await DataContext.Piece
                .Include(x => x.Category)
                .Include(x => x.Promotion)
                .Include(x => x.Сritique)
                .Include(x => x.Favorite)
                .Where(x =>
                    x.Name.ToLower().Contains(_) ||
                    x.Tag.ToLower().Contains(_) ||
                    x.Description.ToLower().Contains(_))
                .OrderBy(x => x.ID)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

#pragma warning restore CA1862 // Use the 'StringComparison' method overloads to perform case-insensitive string comparisons

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new PieceResponse(x)));
        }
    }
}