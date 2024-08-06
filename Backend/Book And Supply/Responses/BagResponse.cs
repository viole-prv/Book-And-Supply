namespace Book_And_Supply
{
    public class BagResponse(Bag _)
    {
        public int ID
        {
            get => _.ID;
        }

        public int Quantity 
        {
            get => _.Quantity;
        }

        #region Piece

        public class IPiece(Piece _)
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

            public string? Picture
            {
                get => _.Picture.FirstOrDefault();
            }

            public PieceResponse.IPrice Price
            {
                get => new(_.Price, _.Promotion);
            }

            public int Count
            {
                get => _.Count;
            }

            public string Category
            {
                get => _.Category.Tag;
            }
        }

        #endregion

        public IPiece Piece
        {
            get => new (_.Piece);
        }
    }
}
