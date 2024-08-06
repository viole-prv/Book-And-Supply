using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController(ILogger<PromotionController> Logger, DataContext DataContext) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо добавить название!")]
            public string Name { get; set; } = "";

            [Required(ErrorMessage = "Необходимо добавить значение!")]
            [Range(1, 100, ErrorMessage = "Значение должно быть в диапазоне от {0}% до {1}%.")]
            public int Value { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult> Entry()
        {
            var T = await DataContext.Promotion
                .OrderBy(x => x.ID)
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] DTO _)
        {
            bool Any = await DataContext.Promotion
                .AsNoTracking()
                .AnyAsync(x => x.Name == _.Name);

            if (Any)
            {
                ModelState.AddModelError(nameof(_.Name), "Это название уже занято!");

                return Conflict(ModelState);
            }

            Promotion T = new()
            {
                Name = _.Name,
                Value = _.Value
            };

            await DataContext.Promotion.AddAsync(T);

            await DataContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("{PromotionID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int PromotionID, [FromBody] DTO _)
        {
            int T = await DataContext.Promotion
                .Where(x => x.ID == PromotionID)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Name, x => _.Name)
                    .SetProperty(x => x.Value, x => _.Value));

            if (T == 0)
            {
                return BadRequest();
            }

            return NoContent();
        }
    }
}