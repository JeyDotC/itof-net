using System.IO;
using System.Collections.Generic;
using System.Linq;
using Itof.Core;
using Itof.Core.Services;

namespace Itof.LocalFileSystem
{
    public class LocalSearchFilesService : ISearchFilesService
    {
        private readonly IMimeMapService _mimeMapService;

        public LocalSearchFilesService(IMimeMapService mimeMapService)
        {
            _mimeMapService = mimeMapService;
        }

        public IEnumerable<FileSystemNode> Search(FileSearch search)
        {
            var result = Enumerable.Empty<FileSystemNode>();

            if (!search.Kind.HasValue || search.Kind.Value == FileSystemNodeKind.Directory)
            {
                result = search.Location.EnumerateDirectories(search.Term, search.SearchOption)
                    .Select(d => d.ToFilesystemNode(search.Location.FullName));
            }

            if (!search.Kind.HasValue || search.Kind.Value == FileSystemNodeKind.File)
            {
                result = result.Concat(
                    search.Location.EnumerateFiles(search.Term, search.SearchOption)
                    .Select(f => f.ToFilesystemNode(_mimeMapService.GetMimeFromExtension((f.Extension ?? string.Empty).TrimStart('.'))))
                );
            }

            return result;
        }
    }
}
