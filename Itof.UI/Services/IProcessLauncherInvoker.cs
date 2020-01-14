using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Itof.UI.Services
{
    public interface IProcessLauncherInvoker
    {
        void StartProcess(DirectoryInfo workingDirectory, string process, string parameters);

        void StartTerminal(DirectoryInfo workingDirectory);

        void OpenFile(FileInfo fileToOpen, string openWith = "");
    }
}
