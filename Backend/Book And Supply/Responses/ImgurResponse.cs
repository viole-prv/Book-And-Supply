using Newtonsoft.Json;

namespace Book_And_Supply
{
    public class ImgurResponse
    {
        #region Data

        public class IData
        {
            #region Link

            [JsonProperty("link")]
            public string? Link { get; set; }

            public bool ShouldSerializeLink() => !string.IsNullOrEmpty(Link);

            #endregion
        }

        #endregion

        [JsonProperty("data")]
        public IData? Data { get; set; }
    }
}
