using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Itof.UI.Filters
{
    public class AvoidExternalRequestsAttribute: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            /*if (!context.HttpContext.Connection.LocalIpAddress.Equals(context.HttpContext.Connection.RemoteIpAddress))
            {
                context.Result = new StatusCodeResult(403);
            }*/
        }
    }
}
