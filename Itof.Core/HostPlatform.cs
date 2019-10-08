using System;
using System.Collections.Generic;

namespace Itof.Core
{
    public sealed class HostPlatform
    {
        public string FullName { get; }

        public IEnumerable<string> WatchIgnore { get; }

        public HostPlatform(string fullName, IEnumerable<string> watchIgnore)
        {
            FullName = fullName;
            WatchIgnore = watchIgnore;
        }

        public static HostPlatform FromCurrentPlatform()
        {

            var platform = Environment.OSVersion.Platform;
            var fullName = Environment.OSVersion.ToString();
            var watchIgnore = WatchIgnoreMap[platform];

            return new HostPlatform(fullName, watchIgnore);
        }

        private static readonly IDictionary<PlatformID, IEnumerable<string>> WatchIgnoreMap = new Dictionary<PlatformID, IEnumerable<string>> {
            [PlatformID.Unix] = new string[]
            {
                ".bash_sessions",
                ".bash_history",
                ".DS_Store",
            },
            [PlatformID.Win32NT] = new string[]
            {

            },
        };
    }
}
