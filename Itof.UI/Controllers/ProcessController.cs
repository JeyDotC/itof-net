using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    public class ProcessController : Controller
    {
       [HttpPost("start")]
       public void Start(string process, string workingDirectory)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName="dotnet",
                Verb="run",

            });
        }
    }
}
