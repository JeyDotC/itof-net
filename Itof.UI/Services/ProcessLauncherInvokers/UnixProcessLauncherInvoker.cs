using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Itof.UI.Services.ProcessLauncherInvokers
{
    class UnixProcessLauncherInvoker : ProcessLauncherInvokerBase
    {
        public override void OpenFile(FileInfo fileToOpen, string openWith = "")
        {
            var openWithParameter = string.IsNullOrEmpty(openWith) ? string.Empty : $"-a \"{openWith}\" ";

            StartProcess(fileToOpen.Directory, "open", $"{openWithParameter}\"{fileToOpen.FullName}\"");
        }

        public override void StartTerminal(DirectoryInfo workingDirectory)
            => StartProcess(workingDirectory, "open", $"-a Terminal \"{workingDirectory.FullName}\"");
    }
}
