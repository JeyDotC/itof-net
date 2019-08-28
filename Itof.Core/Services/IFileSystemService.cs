using System;
using System.Collections.Generic;

namespace Itof.Core.Services
{
    public interface IFileSystemService
    {
        IEnumerable<Drive> ListDrives();

        IEnumerable<FileSystemNode> ListDirectories(string path);

        IEnumerable<FileSystemNode> ListFiles(string path);
    }
}
