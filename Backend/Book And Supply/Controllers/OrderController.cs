using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public partial class OrderController(ILogger<OrderController> Logger, DataContext DataContext, IdentityService IdentityService) : ControllerBase
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

            var T = await DataContext.Yookassa
                .Where(x => x.User.ID == User.ID)
                .Include(x => x.Order).ThenInclude(x => x.Piece).ThenInclude(x => x.Category)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            return Ok(T.Select(x => new OrderResponse(x)));
        }

        [HttpGet]
        [Route("{Tag:required}")]
        [Authorize]
        public async Task<ActionResult> ByTag([FromRoute] string Tag)
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

            var T = await DataContext.Yookassa
                .Where(x => x.Tag == Tag)
                .Where(x => x.User.ID == User.ID)
                .Include(x => x.Order).ThenInclude(x => x.Piece).ThenInclude(x => x.Category)
                .FirstOrDefaultAsync();

            if (T == null)
            {
                return BadRequest();
            }

            return Ok(new OrderResponse(T));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create()
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

            var Bag = await DataContext.Bag
                .Where(x => x.UserID == User.ID)
                .Include(x => x.Piece).ThenInclude(x => x.Promotion)
                .Select(x => new { x.Piece.Tag, Price = new PieceResponse.IPrice(x.Piece.Price, x.Piece.Promotion), x.Quantity })
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            if (Bag == null)
            {
                return Forbid();
            }

            var T = await DataContext.Yookassa
                .Where(x => x.UserID == User.ID)
                .AsNoTracking()
                .ToListAsync();

            if (T == null)
            {
                return BadRequest();
            }

            var Client = new RestClient(
                new RestClientOptions()
                {
                    UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
                    MaxTimeout = 300000,
                    Authenticator = new HttpBasicAuthenticator("386935", "test_9Q6giD2w7qBi6jkr6axKb46wMOA9E2ztudQ4UiwK9QM")
                });

            var Request = new RestRequest("https://api.yookassa.ru/v3/payments");

            Request.AddHeader("Idempotence-Key", Guid.NewGuid());

            Request.AddBody(JsonConvert.SerializeObject(new OrderRequest
            {
                Amount = new OrderRequest.IAmount
                {
                    Value = Bag.Sum(x => x.Price.Current * x.Quantity).ToString(),
                    Currency = "RUB"
                },
                Capture = true,
                Confirmation = new OrderRequest.IConfirmation
                {
                    Type = "redirect",
                    ReturnURL = "http://localhost:3000/profile/order"
                },
                Description = $"Заказ #{T.Count + 1}"
            }));

            var Execute = await Client.ExecutePostAsync(Request);

            if (string.IsNullOrEmpty(Execute.Content))
            {
                return Problem();
            }
            else
            {
                var JSON = JsonConvert.DeserializeObject<YookassaResponse>(Execute.Content);

                if (JSON == null)
                {
                    return Problem();
                }
                else
                {
                    if (string.IsNullOrEmpty(JSON.ID))
                    {
                        return Problem();
                    }
                    else
                    {
                        using var Transaction = await DataContext.Database.BeginTransactionAsync();

                        try
                        {
                            var Yookassa = new Yookassa
                            {
                                Tag = JSON.ID,
                                Condition = "PENDING",
                                Date = DateTime.UtcNow,
                                User = User,
                            };

                            foreach (var _ in Bag)
                            {
                                var Piece = await DataContext.Piece.FirstOrDefaultAsync(x => x.Tag == _.Tag);

                                if (Piece == null) continue;

                                Piece.Count -= _.Quantity;

                                await DataContext.Order.AddAsync(new Order
                                {
                                    Price = _.Price.Current,
                                    Quantity = _.Quantity,
                                    Piece = Piece,
                                    Yookassa = Yookassa
                                });
                            }

                            await DataContext.Yookassa.AddAsync(Yookassa);

                            await DataContext.SaveChangesAsync();

                            int Row = await DataContext.Bag
                                .Where(x => x.UserID == User.ID)
                                .ExecuteDeleteAsync();

                            if (Row == 0)
                            {
                                return BadRequest();
                            }

                            await Transaction.CommitAsync();

                            return NoContent();
                        }
                        catch
                        {
                            await Transaction.RollbackAsync();
                        }
                        finally
                        {
                            await Transaction.DisposeAsync();
                        }

                        return Problem();
                    }
                }
            }
        }

        [HttpPut]
        [Route("{Tag:required}")]
        [Authorize]
        public async Task<ActionResult> Update([FromRoute] string Tag)
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

            var T = await DataContext.Yookassa
                .Where(x => x.Tag == Tag)
                .Where(x => x.UserID == User.ID)
                .Include(x => x.User)
                .Include(x => x.Order).ThenInclude(x => x.Piece)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (T == null)
            {
                return BadRequest();
            }

            var Client = new RestClient(
                new RestClientOptions()
                {
                    UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
                    MaxTimeout = 300000,
                    Authenticator = new HttpBasicAuthenticator("386935", "test_9Q6giD2w7qBi6jkr6axKb46wMOA9E2ztudQ4UiwK9QM")
                });

            var Request = new RestRequest($"https://api.yookassa.ru/v3/payments/{Tag}");

            var Execute = await Client.ExecuteGetAsync(Request);

            if (string.IsNullOrEmpty(Execute.Content))
            {
                return Problem();
            }
            else
            {
                var JSON = JsonConvert.DeserializeObject<YookassaResponse>(Execute.Content);

                if (JSON == null)
                {
                    return Problem();
                }
                else
                {
                    if (string.IsNullOrEmpty(JSON.Condition))
                    {
                        return Problem();
                    }
                    else
                    {
                        using var Transaction = await DataContext.Database.BeginTransactionAsync();

                        try
                        {
                            int SC = 400;

                            T.Condition = JSON.Condition.ToUpper();

                            switch (JSON.Condition.ToUpper())
                            {
                                case "PENDING":

                                    SC = 402;

                                    break;

                                case "CANCELED":

                                    foreach (var _ in T.Order)
                                    {
                                        _.Piece.Count += _.Quantity;
                                    }

                                    break;

                                case "SUCCEEDED":

                                    SC = 204;

                                    break;

                            }

                            await DataContext.SaveChangesAsync();

                            await Transaction.CommitAsync();

                            return StatusCode(SC);
                        }
                        catch
                        {
                            await Transaction.RollbackAsync();
                        }
                        finally
                        {
                            await Transaction.DisposeAsync();
                        }

                        return Problem();
                    }
                }
            }
        }
    }
}