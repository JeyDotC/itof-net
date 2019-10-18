using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        void MoveFileSystemEntry(string path, string newPath);

        void CopyFile(string sourceFile, string destinationFile);

        void CopyDirectory(string sourceDirectory, string targetDirectory, Action<Progress> progress);
    }
}
