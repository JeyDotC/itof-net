using System;
using System.Linq;

namespace Itof.Core
{
    public struct FileSystemNode
    {
        public string Name { get; }

        public string Extension{ get; }

        public string FullName { get;}

        public string Directory { get; }

        public DateTime DateCreated { get; }

        public DateTime DateModified { get; }

        public long Size { get; }

        public FileSystemNodeKind Kind { get; }

        public string Mime { get; }

        public FileSystemNode(string name, string extension, string fullName, string directory, DateTime dateCreated, DateTime dateModified, long size, FileSystemNodeKind kind, string mime="")
            : this()
        {
            Name = name;
            Extension = extension;
            FullName = fullName;
            Directory = directory;
            DateCreated = dateCreated;
            DateModified = dateModified;
            Size = size;
            Kind = kind;
            Mime = mime;
        }

        public static FileSystemNode CreateDirectory(string name, string baseDir, DateTime dateCreated, DateTime dateModified, string separator = "/")
         => new FileSystemNode(name, string.Empty, $"{baseDir}{separator}{name}", baseDir, dateCreated, dateModified, 0, FileSystemNodeKind.Directory);

        public static FileSystemNode CreateFile(string nameWithExtension, string baseDir, DateTime dateCreated, DateTime dateModified, long size, string separator = "/", string mime="application/octect-stream")
         => new FileSystemNode(nameWithExtension, nameWithExtension.Split('.').LastOrDefault() ?? string.Empty, $"{baseDir}{separator}{nameWithExtension}", baseDir, dateCreated, dateModified, size, FileSystemNodeKind.File, mime: mime);

        public static FileSystemNode CreateDrive(string route, long size)
         => new FileSystemNode(route, string.Empty, string.Empty, route, DateTime.MinValue, DateTime.MinValue, size, FileSystemNodeKind.Drive);

    }
}
