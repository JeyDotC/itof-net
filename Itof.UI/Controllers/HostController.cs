using System;
using System.Collections.Generic;
using Itof.Core;
using Itof.Core.Services;
using Itof.UI.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    [ExceptionSerializationFilter]
    [AvoidExternalRequests]
    public class HostController : Controller
    {
        private readonly IApplicationCatalog _applicationCatalog;

        public HostController(IApplicationCatalog applicationCatalog)
        {
            _applicationCatalog = applicationCatalog;
        }

        [Route("applications")]
        public IEnumerable<ApplicationInfo> Applications() => _applicationCatalog.ListApps();
    }
}
