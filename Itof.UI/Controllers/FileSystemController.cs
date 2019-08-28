using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itof.Core;
using Itof.Core.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
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
        public IEnumerable<FileSystemNode> Directories(string path="/")
        {
            return _filesystem.ListDirectories(path);
        }

        [HttpGet("files")]
        public IEnumerable<FileSystemNode> Files(string path="/")
        {
            return _filesystem.ListFiles(path);
        }
    
    }
}
