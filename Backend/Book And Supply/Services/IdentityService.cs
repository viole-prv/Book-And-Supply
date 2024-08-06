namespace Book_And_Supply
{
    public class IdentityService(IHttpContextAccessor HttpContextAccessor)
    {
        public string? Name()
        {
            return HttpContextAccessor.HttpContext?.User?.Identity?.Name;
        }
    }
}
