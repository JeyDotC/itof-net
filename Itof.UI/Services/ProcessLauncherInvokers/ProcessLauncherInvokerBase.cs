using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Itof.UI.Services.ProcessLauncherInvokers
{
    internal abstract class ProcessLauncherInvokerBase : IProcessLauncherInvoker
    {
        public void StartProcess(DirectoryInfo workingDir, string process, string parameters)
            => Process.Start(new ProcessStartInfo
            {
                FileName = "dotnet",
                WindowStyle = ProcessWindowStyle.Hidden,
                WorkingDirectory = AppContext.BaseDirectory,
                Arguments = string.Join(' ', "./Itof.ProcessLauncher.dll", process, workingDir.FullName, parameters ?? string.Empty)
            });

        public abstract void OpenFile(FileInfo fileToOpen, string openWith = "");

        public abstract void StartTerminal(DirectoryInfo workingDirectory);
    }
}
