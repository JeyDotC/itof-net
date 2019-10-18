using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Itof.Core;
using Itof.Core.Services;

namespace Itof.LocalFileSystem
{
    public class LocalFileSystemService : IFileSystemService
    {
        private IMimeMapService _mimeMapService;

        public LocalFileSystemService(IMimeMapService mimeMapService)
        {
            _mimeMapService = mimeMapService;
        }

        public void CreateDirectory(string newDirectoryPath) => new DirectoryInfo(newDirectoryPath).Create();

        public void CreateFile(string newFilePath) => new FileInfo(newFilePath).Create();

        public IEnumerable<FileSystemNode> ListDirectories(string path)
            => new DirectoryInfo(path).EnumerateDirectories()
                .Select(d => FileSystemNode.CreateDirectory(d.Name, path, d.CreationTime, d.LastWriteTime));

        public IEnumerable<Drive> ListDrives()
            => DriveInfo.GetDrives()
                .Select(Drive.FromDriveInfo);

        public IEnumerable<FileSystemNode> ListFiles(string path)
            => new DirectoryInfo(path).EnumerateFiles()
                .Select(f => FileSystemNode.CreateFile(
                    f.Name,
                    f.Directory.FullName,
                    f.CreationTime,
                    f.LastWriteTime,
                    f.Length,
                    mime: _mimeMapService.GetMimeFromExtension((f.Extension ?? string.Empty).TrimStart('.'))
                ));

        public void MoveFileSystemEntry(string path, string newPath) => Directory.Move(path, newPath);

        public void RemoveFile(string path) => File.Delete(path);

        public void RemoveDirectory(string path) => Directory.Delete(path, recursive: true);

        public void CopyFile(string sourceFile, string destinationFile) => File.Copy(sourceFile, destinationFile);

        public async Task CopyDirectory(string sourceDirectory, string targetDirectory, Action<Progress> progress)
        {
            var sourceDirInfo = new DirectoryInfo(sourceDirectory);

            progress(new Progress("Calculating...", 0, 1));
            var allFiles = new DirectoryInfo(sourceDirectory).EnumerateFiles("*", SearchOption.AllDirectories).ToList();
            var totalFileBytes = allFiles.Sum(f => f.Length);
            progress(new Progress("Calculating...", 1, 1));

            var copiedFileBytes = 0l;

            progress(new Progress("Copying...", copiedFileBytes, totalFileBytes));

            foreach (var dir in Directory.EnumerateDirectories(sourceDirectory, "*", SearchOption.AllDirectories))
            {
                Directory.CreateDirectory(Path.Combine(targetDirectory, dir.Substring(sourceDirectory.Length + 1)));
            }

            foreach (var file in allFiles)
            {
                var relativeFilePath = file.FullName.Substring(sourceDirectory.Length);
                progress(new Progress($"Copying {relativeFilePath}...", copiedFileBytes, totalFileBytes));
                await Task.Run(() => file.CopyTo(Path.Combine(targetDirectory, relativeFilePath)));
                copiedFileBytes += file.Length;
            }

            progress(new Progress($"Completed.", copiedFileBytes, totalFileBytes));
        }
    }
}
