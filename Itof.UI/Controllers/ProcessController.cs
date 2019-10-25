using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections;
using System.IO;
using Itof.UI.Filters;
using Itof.UI.Services;

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    [ExceptionSerializationFilter]
    [AvoidExternalRequests]
    public class ProcessController : Controller
    {
        private readonly IProcessLauncherInvoker _processLauncherInvoker;

        public ProcessController(IProcessLauncherInvoker processLauncherInvoker)
        {
            _processLauncherInvoker = processLauncherInvoker;
        }

        // Mac OS: open -a Terminal $dir
        [HttpPost("{process}")]
        public void Start(string process, string at, string p) 
            => _processLauncherInvoker.StartProcess(new DirectoryInfo(at), process, p);

        [HttpPost("OsTerminal")]
        public void OpenTerminal(string at)
            => _processLauncherInvoker.StartTerminal(new DirectoryInfo(at));

        [HttpPost("OsOpen")]
        public void OpenFile(string file)
            => _processLauncherInvoker.OpenFile(new FileInfo(file));
    }
}
