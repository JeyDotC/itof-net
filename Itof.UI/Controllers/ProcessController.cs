using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections;

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    public class ProcessController : Controller
    {
        // Mac OS: open -a Terminal $dir
        [HttpPost("{process}")]
        public void Start(string process, string at, string p)
        {
            var processInfo = new ProcessStartInfo
            {
                FileName = "dotnet",
                WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden,
                WorkingDirectory = AppContext.BaseDirectory,

                Arguments = string.Join(' ', "./Itof.ProcessLauncher.dll", process, at ?? ".", p ?? string.Empty)
            };

            var thing = Process.Start(processInfo);
        }
    }
}
