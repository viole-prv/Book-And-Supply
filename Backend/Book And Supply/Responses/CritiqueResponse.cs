using System.Globalization;

namespace Book_And_Supply
{
    public class CritiqueResponse(Critique _)
    {
        public int ID
        {
            get => _.ID;
        }  
        
        public int Star
        {
            get => _.Star;
        }

        public string Message
        {
            get => _.Message;
        }

        public string Date
        {
            get => _.Date.ToString("dd MMM yyyy г.", new CultureInfo("ru-RU"));
        }

        public string Name
        {
            get => $"{_.User.FirstName} {_.User.LastName?[..1].ToUpper()}.";
        }

        public string Picture
        {
            get => _.User.Picture;
        }
    }
}
