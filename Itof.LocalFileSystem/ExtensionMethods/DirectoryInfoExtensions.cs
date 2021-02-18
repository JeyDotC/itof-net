using Itof.Core;

namespace System.IO
{
    internal static class DirectoryInfoExtensions
    {
        public static FileSystemNode ToFilesystemNode(this DirectoryInfo directory, string atPath = null)
            => FileSystemNode.CreateDirectory(directory.Name, atPath ?? directory.Parent.FullName, directory.CreationTime, directory.LastWriteTime);
    }
}
