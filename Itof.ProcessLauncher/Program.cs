using System;
using System.Linq;

namespace Itof.ProcessLauncher
{
    /**
     * Dummy Attribute to make app hold a reference to this assembly.
     */
    [AttributeUsage(AttributeTargets.Assembly)]
    public class RefAttribute : Attribute
    {

    }

    class Program
    {
        static void Main(string[] args)
        {
            var process = args[0];
            var workingDir = args[1];
            var arguments = args.Skip(2).ToList();

            Console.Out.WriteLine(workingDir);

            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = process,
                WorkingDirectory = workingDir,
                Arguments = string.Join(' ', arguments),
                WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden
            });
        }
    }
}
