using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController(ILogger<CategoryController> Logger, DataContext DataContext) : ControllerBase
    {
        public class DTO
        {
            [Required(ErrorMessage = "Необходимо добавить метку!")]
            public string Tag { get; set; } = "";

            [Required(ErrorMessage = "Необходимо добавить название!")]
            public string Name { get; set; } = "";

            [Required(ErrorMessage = "Необходимо добавить свойство!")]
            public List<Property> Property { get; set; } = [];
        }

        [HttpGet]
        public async Task<ActionResult> Entry()
        {
            var T = await DataContext.Category
                .Include(x => x.Piece)
                .OrderBy(x => x.ID)
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(T.Select(x => new CategoryResponse(x)));
        }

        [HttpGet]
        [Route("{Tag:required}")]
        public async Task<ActionResult> ByTag([FromRoute] string Tag)
        {
            var T = await DataContext.Category
                .Where(x => x.Tag == Tag)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(new CategoryResponse(T));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] DTO _)
        {
            bool Any = await DataContext.Category
                .AsNoTracking()
                .AnyAsync(x => x.Name == _.Name);

            if (Any)
            {
                ModelState.AddModelError(nameof(_.Name), "Это название уже занято!");

                return Conflict(ModelState);
            }

            Category T = new()
            {
                Tag = _.Tag,
                Name = _.Name,
                Property = _.Property
            };

            await DataContext.Category.AddAsync(T);

            await DataContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("{CategoryID:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] int CategoryID, [FromBody] DTO _)
        {
            int T = await DataContext.Category
                .Where(x => x.ID == CategoryID)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Tag, x => _.Tag)
                    .SetProperty(x => x.Name, x => _.Name)
                    .SetProperty(x => x.Property, x => _.Property));

            if (T == 0)
            {
                return BadRequest();
            }

            return NoContent();
        }
    }
}