using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Itof.UI.Filters
{
    public class ExceptionSerializationFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            context.Result = new JsonResult(new
            {
                message = context.Exception.Message,
                type = context.Exception.GetType().Name
            })
            {
                StatusCode = 500
            };
        }
    }
}
