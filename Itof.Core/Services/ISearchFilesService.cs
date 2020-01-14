using System;
using System.Collections.Generic;

namespace Itof.Core.Services
{
    public interface ISearchFilesService
    {
        public IEnumerable<FileSystemNode> Search(FileSearch search);
    }
}
