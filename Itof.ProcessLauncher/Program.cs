using System;

namespace Itof.ProcessLauncher
{
    class Program
    {
        static void Main(string[] args)
        {
            var process = args[0];
            var workingDir = args[1];

            Console.Out.WriteLine(workingDir);

            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = process,
                WorkingDirectory = workingDir,
                WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden
            });
        }
    }
}
