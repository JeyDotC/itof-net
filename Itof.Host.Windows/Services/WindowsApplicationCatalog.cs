using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Itof.Core;
using Itof.Core.Services;
using Microsoft.Win32;

namespace Itof.Host.Windows.Services
{
    internal class AppInfoComparer : IEqualityComparer<ApplicationInfo>
    {
        public bool Equals(ApplicationInfo x, ApplicationInfo y)
        {
            return x.Name == y.Name;
        }

        public int GetHashCode([DisallowNull] ApplicationInfo obj)
        {
            return obj.GetHashCode();
        }
    }

    public class WindowsApplicationCatalog : IApplicationCatalog
    {
        [SuppressMessage("Interoperability", "CA1416:Validate platform compatibility", Justification = "This class will be injected by an OS aware service container.")]
        public IEnumerable<ApplicationInfo> ListApps()
        {
            var registry_key = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
            var results = new List<ApplicationInfo>();

            using var key = Registry.LocalMachine.OpenSubKey(registry_key);

            foreach (var subKeyName in key.GetSubKeyNames())
            {
                using var subkey = key.OpenSubKey(subKeyName);

                results.Add(new ApplicationInfo
                {
                    Name = (string)subkey.GetValue("DisplayName"),
                    Path = (string)subkey.GetValue("InstallLocation"),
                });
            }

            return results.Where(info => !string.IsNullOrEmpty(info.Name))
                           .Distinct(new AppInfoComparer())
                          .OrderBy(info => info.Name);
        }
    }
}
