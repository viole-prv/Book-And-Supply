using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Book_And_Supply
{
    public class Filter : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext Context)
        {
            if (Context.ModelState.ErrorCount > 0)
            {
                Context.Result = new BadRequestObjectResult(Context.ModelState);
            }

            base.OnResultExecuting(Context);
        }
    }
}
