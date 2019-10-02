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
        private FileSystemWatcher _watcher;

        public async Task ListenTo(string path)
        {
            EnsureNoWatcher();

            _watcher = new FileSystemWatcher
            {
                Path = path,
                NotifyFilter = NotifyFilters.FileName | NotifyFilters.DirectoryName,
                IncludeSubdirectories = false,
            };

            _watcher.Changed += OnChanged;
            _watcher.Created += OnChanged;
            _watcher.Deleted += OnChanged;
            _watcher.Renamed += OnRenamed;

            await Clients.All.SendAsync("Connected", path);
        }

        private void OnRenamed(object sender, RenamedEventArgs e)
        {
            Clients.All.SendAsync("DirectoryChanged", e.FullPath);
        }

        private void OnChanged(object sender, FileSystemEventArgs e)
        {
            Clients.All.SendAsync("DirectoryChanged", e.FullPath);
        }

        private void EnsureNoWatcher()
        {
            if(_watcher != null)
            {
                _watcher.Dispose();
            }
            _watcher = null;
        }

        protected override void Dispose(bool disposing)
        {
            if(disposing && _watcher != null)
            {
                _watcher.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
