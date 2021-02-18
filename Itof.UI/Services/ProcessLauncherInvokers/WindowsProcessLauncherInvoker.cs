using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Itof.UI.Services.ProcessLauncherInvokers
{
    class WindowsProcessLauncherInvoker : ProcessLauncherInvokerBase
    {
        public override void OpenFile(FileInfo fileToOpen, string openWith = "")
        {
            if(!string.IsNullOrEmpty(openWith))
            {
                throw new NotImplementedException("OpenWith parameter is not yet implemented in Windows.");
            }
            StartProcess(fileToOpen.Directory, "cmd", $"/c start \"{fileToOpen.FullName}\"");
        }

        public override void StartTerminal(DirectoryInfo workingDirectory)
            => StartProcess(workingDirectory, "cmd", $"/c start cmd.exe");
    }
}
