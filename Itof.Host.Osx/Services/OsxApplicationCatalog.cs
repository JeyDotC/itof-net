using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Itof.Core;
using Itof.Core.Services;

namespace Itof.Host.Osx.Services
{
    class ByNameComparer : EqualityComparer<FileSystemNode>
    {
        public override bool Equals([AllowNull] FileSystemNode x, [AllowNull] FileSystemNode y)
        {
            //Check whether the compared objects reference the same data.
            if (ReferenceEquals(x, y)) return true;

            //Check whether any of the compared objects is null.
            if (ReferenceEquals(x, null) || ReferenceEquals(y, null))
                return false;

            return x.Name == y.Name;
        }

        public override int GetHashCode([DisallowNull] FileSystemNode obj) => obj.GetHashCode();
    }

    public class OsxApplicationCatalog : IApplicationCatalog
    {
        private readonly ISearchFilesService _searchFiles;

        public OsxApplicationCatalog(ISearchFilesService searchFiles)
        {
            _searchFiles = searchFiles;
        }

        public IEnumerable<ApplicationInfo> ListApps()
        {
            var directories = _searchFiles.Search(new FileSearch {
                Location = new System.IO.DirectoryInfo("/Applications"),
                Kind = FileSystemNodeKind.Directory,
                Term = "*.app",
                SearchOption = new System.IO.EnumerationOptions
                {
                    IgnoreInaccessible = true,
                    ReturnSpecialDirectories = false,
                    RecurseSubdirectories = true
                }
            })
            .Distinct(new ByNameComparer())
            .OrderBy(e => e.Name);

            return directories.Select(f => new ApplicationInfo
            {
                Name = f.Name[0..^4],
                Path = f.FullName
            });
        }
    }
}
