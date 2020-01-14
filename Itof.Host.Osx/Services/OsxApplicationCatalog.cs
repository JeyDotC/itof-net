using System;
using System.Collections.Generic;
using System.Linq;
using Itof.Core;
using Itof.Core.Services;

namespace Itof.Host.Osx.Services
{
    public class OsxApplicationCatalog : IApplicationCatalog
    {
        private readonly IFileSystemService _fileSystem;

        public OsxApplicationCatalog(IFileSystemService fileSystem)
        {
            _fileSystem = fileSystem;
        }

        public IEnumerable<ApplicationInfo> ListApps()
        {
            var directories = _fileSystem.ListDirectories("/Applications").Where(d => d.Name.EndsWith(".app", StringComparison.Ordinal));

            return directories.Select(f => new ApplicationInfo
            {
                Name = f.Name[0..^4],
                Path = f.FullName
            });
        }
    }
}
