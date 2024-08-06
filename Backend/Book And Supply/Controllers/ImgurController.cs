using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace Book_And_Supply
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImgurController(ILogger<ImgurController> Logger) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Entry([FromForm] IFormFile File)
        {
            var Client = new RestClient(
                new RestClientOptions()
                {
                    UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
                    MaxTimeout = 300000
                });

            var Request = new RestRequest("https://api.imgur.com/3/image");

            Request.AddHeader("Authorization", "Client-ID 763f44f7b503c79");

            byte[] T;

            using (var MemoryStream = new MemoryStream())
            {
                await File.CopyToAsync(MemoryStream);

                T = MemoryStream.ToArray();
            }

            Request.AddFile("image", T, File.FileName);

            var Execute = await Client.ExecutePostAsync(Request);

            if (string.IsNullOrEmpty(Execute.Content))
            {
                return Problem();
            }
            else
            {
                var JSON = JsonConvert.DeserializeObject<ImgurResponse>(Execute.Content);

                if (JSON == null || JSON.Data == null)
                {
                    return Problem();
                }
                else
                {
                    if (string.IsNullOrEmpty(JSON.Data.Link))
                    {
                        return Problem();
                    }
                    else
                    {
                        return Ok(JSON.Data.Link);
                    }
                }
            }
        }
    }
}