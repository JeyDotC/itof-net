using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itof.Core;
using Itof.Core.Services;
using Itof.UI.Filters;
using Itof.UI.Hubs;
using Itof.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Itof.UI.Controllers
{
    [Route("api/[controller]")]
    [ExceptionSerializationFilter]
    [AvoidExternalRequests]
    public class FileSystemController : Controller
    {
        private readonly IFileSystemService _filesystem;
        private readonly IHubContext<FileSystemHub> _hub;

        public FileSystemController(IFileSystemService fileSystem, IHubContext<FileSystemHub> hub)
        {
            _filesystem = fileSystem;
            _hub = hub;
        }

        [HttpGet("drives")]
        public IEnumerable<Drive> Drives() => _filesystem.ListDrives();

        [HttpGet("dirs")]
        public IEnumerable<FileSystemNode> Directories(string path = "/", string orderByName = "asc") => _filesystem.ListDirectories(path).OrderBy(f => f.Name, new NaturalSortComparer());

        [HttpPost("dirs")]
        public void CreateDirectory(string path) => _filesystem.CreateDirectory(path);

        [HttpPut("dirs")]
        public void MoveDirectory(string path, string newPath) => _filesystem.MoveFileSystemEntry(path, newPath);

        [HttpDelete("dirs")]
        public void RemoveDirectory(string path) => _filesystem.RemoveDirectory(path);

        [HttpPost("dirs/copy")]
        public async void CopyDirectory(string source, string destination)
        {
            await _filesystem.CopyDirectory(source, destination, progress => _hub.Clients.All.SendAsync("CopyDirectoryProgress", progress));
            await _hub.Clients.All.SendAsync("CopyDirectoryCompleted");
        }

        [HttpGet("files")]
        public IEnumerable<FileSystemNode> Files(string path = "/", string orderByName = "asc") => _filesystem.ListFiles(path).OrderBy(f => f.Name, new NaturalSortComparer());

        [HttpPost("files")]
        public void CreateFile(string path) => _filesystem.CreateFile(path);

        [HttpDelete("files")]
        public void RemoveFile(string path) => _filesystem.RemoveFile(path);

        [HttpPost("files/copy")]
        public async void CopyFile(string source, string destination)
        {
            _filesystem.CopyFile(source, destination);
            await _hub.Clients.All.SendAsync("CopyDirectoryCompleted");
        }
    }
}
