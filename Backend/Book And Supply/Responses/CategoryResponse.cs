namespace Book_And_Supply
{
    public class CategoryResponse(Category _)
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

        #region Property

        public class IProperty(Property _)
        {
            public string Name
            {
                get => _.Name;
            }

            public class IPair(string _)
            {
                public string Key
                {
                    get => _;
                }

                public bool Value
                {
                    get => false;
                }
            }

            public IEnumerable<IPair> Array
            {
                get => _.Array.Select(x => new IPair(x));
            }
        }

        #endregion

        public IEnumerable<IProperty> Property
        {
            get => _.Property.Select(x => new IProperty(x));
        }  
    }
}
