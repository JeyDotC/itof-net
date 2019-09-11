using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections;
using System.IO;

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    public class ProcessController : Controller
    {
        // Mac OS: open -a Terminal $dir
        [HttpPost("{process}")]
        public void Start(string process, string at, string p)
        {
            RunProcess(process, at, p);
        }

        [HttpPost("OsTerminal")]
        public void OpenTerminal(string at)
        {
            switch(Environment.OSVersion.Platform)
            {
                case PlatformID.Unix:
                    RunProcess("open", at, $"-a Terminal {at}");
                    break;

                case PlatformID.Win32NT:
                    RunProcess("cmd", at, string.Empty);
                    break;
            }
        }

        [HttpPost("OsOpen")]
        public void OpenFile(string file)
        {
            var fileInfo = new FileInfo(file);

            switch (Environment.OSVersion.Platform)
            {
                case PlatformID.Unix:
                    RunProcess("open", fileInfo.DirectoryName, fileInfo.FullName);
                    break;

                case PlatformID.Win32NT:
                    RunProcess("cmd", fileInfo.DirectoryName, $"/c start \"{fileInfo.FullName}\"");
                    break;
            }
        }

        private Process RunProcess(string process, string workingDir, string parameters)
            => Process.Start(new ProcessStartInfo
            {
                FileName = "dotnet",
                WindowStyle = ProcessWindowStyle.Hidden,
                WorkingDirectory = AppContext.BaseDirectory,

                Arguments = string.Join(' ', "./Itof.ProcessLauncher.dll", process, workingDir ?? ".", parameters ?? string.Empty)
            });
    }
}
