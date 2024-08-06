namespace Book_And_Supply
{
    public class UserResponse(User _)
    {
        public int ID
        {
            get => _.ID;
        }

        public string Login
        {
            get => _.Login;
        }

        public string FirstName
        {
            get => _.FirstName;
        }

        public string LastName
        {
            get => _.LastName;
        }

        public string Picture
        {
            get => _.Picture;
        }

        public string Day
        {
            get => _.Day;
        }

        public string Month
        {
            get => _.Month;
        }

        public string Year
        {
            get => _.Year;
        }

        public string PhoneNumber
        {
            get => _.PhoneNumber;
        }

        public string EMail
        {
            get => _.EMail;
        }

        public string? SessionToken
        {
            get => _.SessionToken;
        }
    }
}
