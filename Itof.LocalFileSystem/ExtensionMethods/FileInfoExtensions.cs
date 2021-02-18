using Itof.Core;

namespace System.IO
{
    internal static class FileInfoExtensions
    {
        public static FileSystemNode ToFilesystemNode(this FileInfo file, string mime = "")
            => FileSystemNode.CreateFile(
                    file.Name,
                    file.Directory.FullName,
                    file.CreationTime,
                    file.LastWriteTime,
                    file.Length,
                    Path.DirectorySeparatorChar.ToString(),
                    mime);
    }
}
