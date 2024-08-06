using System.Globalization;

namespace Book_And_Supply
{
    public class OrderResponse(Yookassa _)
    {
        public int ID
        {
            get => _.ID;
        }   
        
        public string Tag
        {
            get => _.Tag;
        }

        public string Condition
        {
            get => _.Condition;
        }

        public decimal Price
        {
            get => _.Order.Sum(x => x.Price * x.Quantity);
        }

        public int Quantity
        {
            get => _.Order.Sum(x => x.Quantity);
        }

        public string Date
        {
            get => _.Date.ToString("dd MMM yyyy г.", new CultureInfo("ru-RU"));
        }

        #region Piece

        public class IPiece(Order _)
        {
            public int ID
            {
                get => _.Piece.ID;
            }

            public string Tag
            {
                get => _.Piece.Tag;
            }    
            
            public string Name
            {
                get => _.Piece.Name;
            }

            public string? Picture
            {
                get => _.Piece.Picture.FirstOrDefault();
            }

            public decimal Price
            {
                get => _.Price;
            }

            public int Quantity
            {
                get => _.Quantity;
            }

            public string Category
            {
                get => _.Piece.Category.Tag;
            }
        }

        #endregion

        public IEnumerable<IPiece> Piece
        {
            get => _.Order.Select(x => new IPiece(x));
        }
    }
}
