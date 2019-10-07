using Itof.UI.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Itof.UI.Hubs
{
    public class FileSystemHub : Hub
    {
        public const string DirectoryChangedOperation = "DirectoryChanged";
        private readonly FileSystemWatcherBridge _fileSystemWatcherBridge;

        public FileSystemHub(FileSystemWatcherBridge fileSystemWatcherBridge)
        {
            _fileSystemWatcherBridge = fileSystemWatcherBridge;
        }

        public async Task ListenTo(string path)
        {
            _fileSystemWatcherBridge.Watch(path);

            await Clients.All.SendAsync("Connected", path);
        }
    }
}
