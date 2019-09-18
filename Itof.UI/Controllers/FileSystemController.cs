using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itof.Core;
using Itof.Core.Services;
using Itof.UI.Filters;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    [ExceptionSerializationFilter]
    [AvoidExternalRequests]
    public class FileSystemController : Controller
    {
        private readonly IFileSystemService _filesystem;

        public FileSystemController(IFileSystemService fileSystem)
        {
            _filesystem = fileSystem;
        }

        [HttpGet("drives")]
        public IEnumerable<Drive> Drives()
        {
            return _filesystem.ListDrives();
        }

        [HttpGet("dirs")]
        public IEnumerable<FileSystemNode> Directories(string path="/", string orderByName="asc")
        {
            return _filesystem.ListDirectories(path).OrderBy(f => f.Name);
        }

        [HttpGet("files")]
        public IEnumerable<FileSystemNode> Files(string path="/", string orderByName = "asc")
        {
            return _filesystem.ListFiles(path).OrderBy(f => f.Name);
        }
    
    }
}
