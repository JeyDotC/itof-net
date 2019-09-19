﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
    }
}
