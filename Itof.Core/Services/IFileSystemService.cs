using System;
using System.Collections.Generic;

namespace Itof.Core.Services
{
    public interface IFileSystemService
    {
        IEnumerable<Drive> ListDrives();

        IEnumerable<FileSystemNode> ListDirectories(string path);

        IEnumerable<FileSystemNode> ListFiles(string path);

        void CreateDirectory(string newDirectoryPath);

        void RemoveDirectory(string path);

        void CreateFile(string newFilePath);

        void RemoveFile(string path);

        void MoveDirectory(string path, string newPath);
    }
}
