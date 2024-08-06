namespace Book_And_Supply
{
    public class PieceResponse(Piece _)
    {
        public int ID
        {
            get => _.ID;
        }

        public string Tag
        {
            get => _.Tag;
        }

        public string Name
        {
            get => _.Name;
        }

        public List<string> Picture
        {
            get => _.Picture;
        }

        #region Price

        public class IPrice(decimal Price, Promotion _)
        {
            public decimal Current
            {
                get => _ == null ? Price : Math.Floor(Price * (1 - (decimal)_.Value / 100));
            }

            #region Init

            public decimal Primary
            {
                get => _ == null ? 0 : Price;
            }

            public bool ShouldSerializePrimary() => Primary > 0;

            #endregion

            #region Rate

            public int Rate
            {
                get => _ == null ? 0 : _.Value;
            }

            public bool ShouldSerializeRate() => Rate > 0;

            #endregion
        }

        #endregion

        public IPrice Price
        {
            get => new(_.Price, _.Promotion);
        }

        public List<Property> Property
        {
            get => _.Property;
        }  
        
        public string Description
        {
            get => _.Description;
        }

        public int Count
        {
            get => _.Count;
        }

        #region Category

        public class ICategory(Category _)
        {
            public int ID
            {
                get => _.ID;
            }

            public string Tag
            {
                get => _.Tag;
            }
        }

        #endregion

        public ICategory? Category
        {
            get => _.Category == null ? null : new(_.Category);
        }

        #region Category

        public class IPromotion(Promotion _)
        {
            public int ID
            {
                get => _.ID;
            }

            public string Name
            {
                get => _.Name;
            }
        }

        #endregion

        public IPromotion? Promotion
        {
            get => _.Promotion == null ? null : new(_.Promotion);
        }

        public int Favorite
        {
            get => _.Favorite.Count;
        }

        #region Critique

        public class ICritique(ICollection<Critique> _)
        {
            public double Star
            {
                get
                {
                    if (_.Count == 0)
                    {
                        return 0d;
                    }

                    return Math.Round(_.Average(x => x.Star), 2);
                }
            }

            public int Count
            {
                get => _.Count;
            }

            public Dictionary<int, int> Score
            {
                get => _.GroupBy(x => x.Star).Select(x => new { x.Key, Count = x.Count() }).OrderBy(x => x.Key).ToDictionary(x => x.Key, x => x.Count);
            }
        }

        #endregion

        public ICritique Critique
        {
            get => new(_.Сritique);
        }
    }
}
