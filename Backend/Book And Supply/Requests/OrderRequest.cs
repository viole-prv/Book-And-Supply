using Newtonsoft.Json;

namespace Book_And_Supply
{
    public class OrderRequest
    {
        [JsonProperty("id")]
        public string? ID { get; set; }

        public class IAmount
        {
            [JsonProperty("value")]
            public string? Value { get; set; }

            [JsonProperty("currency")]
            public string? Currency { get; set; }
        }

        [JsonProperty("amount")]
        public IAmount? Amount { get; set; }

        [JsonProperty("capture")]
        public bool Capture { get; set; }

        public class IConfirmation
        {
            [JsonProperty("type")]
            public string? Type { get; set; }

            [JsonProperty("return_url")]
            public string? ReturnURL { get; set; }
        }

        [JsonProperty("confirmation")]
        public IConfirmation? Confirmation { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }
    }
}