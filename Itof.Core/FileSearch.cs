using System;
using System.IO;

namespace Itof.Core
{
    public struct FileSearch
    {
        public FileSystemNodeKind? Kind { get; set; }

        public DirectoryInfo Location { get; set; }

        public string Term { get; set; }

        public EnumerationOptions SearchOption { get; set; }
    }
}
