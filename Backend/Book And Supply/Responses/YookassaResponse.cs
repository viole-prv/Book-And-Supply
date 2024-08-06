using Newtonsoft.Json;

namespace Book_And_Supply
{
    public class YookassaResponse
    {
        [JsonProperty("id")]
        public string? ID { get; set; }

        [JsonProperty("status")]
        public string? Condition { get; set; }
    }
}
