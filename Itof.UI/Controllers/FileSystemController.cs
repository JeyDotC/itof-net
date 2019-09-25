using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itof.Core;
using Itof.Core.Services;
using Itof.UI.Filters;
using Itof.UI.Services;
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
        public IEnumerable<Drive> Drives() => _filesystem.ListDrives();

        [HttpGet("dirs")]
        public IEnumerable<FileSystemNode> Directories(string path = "/", string orderByName = "asc") => _filesystem.ListDirectories(path).OrderBy(f => f.Name, new NaturalSortComparer());

        [HttpPost("dirs")]
        public void CreateDirectory(string path) => _filesystem.CreateDirectory(path);

        [HttpPut("dirs")]
        public void MoveDirectory(string path, string newPath) => _filesystem.MoveDirectory(path, newPath);

        [HttpDelete("dirs")]
        public void RemoveDirectory(string path) => _filesystem.RemoveDirectory(path);

        [HttpGet("files")]
        public IEnumerable<FileSystemNode> Files(string path = "/", string orderByName = "asc") => _filesystem.ListFiles(path).OrderBy(f => f.Name, new NaturalSortComparer());

        [HttpPost("files")]
        public void CreateFile(string path) => _filesystem.CreateFile(path);

        [HttpDelete("files")]
        public void RemoveFile(string path) => _filesystem.RemoveFile(path);

    }
}
