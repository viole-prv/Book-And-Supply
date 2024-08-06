namespace Book_And_Supply
{
    public class RangeResponse(List<decimal> _)
    {
        public decimal Min
        {
            get => _.Min();
        }

        public List<decimal> Value
        {
            get => [Min, Max];
        }

        public decimal Max
        {
            get => _.Max();
        }
    }
}
