using System;
using System.IO;
using System.Linq;
using Itof.Core;
using Itof.UI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Itof.UI.Services
{
    public class FileSystemWatcherBridge : IDisposable
    {
        private readonly IHubContext<FileSystemHub> _hubContext;
        private readonly HostPlatform _hostPlatform;
        private FileSystemWatcher _fileSystemWatcher;

        public FileSystemWatcherBridge(IHubContext<FileSystemHub> hubContext, HostPlatform hostPlatform)
        {
            _hubContext = hubContext;
            _hostPlatform = hostPlatform;
        }

        public void Watch(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return;
            }

            if (path.StartsWith("//", StringComparison.InvariantCulture))
            {
                path = $@"/{path.TrimStart('/')}";
            }

            if(_fileSystemWatcher != null)
            {
                _fileSystemWatcher.Dispose();
            }

            _fileSystemWatcher = new FileSystemWatcher {
                Path = path,
                IncludeSubdirectories = false,
                EnableRaisingEvents = true,
                
            };

            _fileSystemWatcher.Changed += OnChanged;
            _fileSystemWatcher.Created += OnChanged;
            _fileSystemWatcher.Deleted += OnChanged;
            _fileSystemWatcher.Renamed += OnRenamed;
        }

        private void OnRenamed(object sender, RenamedEventArgs e)
        {
            if (_hostPlatform.WatchIgnore.Contains(e.Name))
            {
                return;
            }
            _hubContext.Clients.All.SendAsync(FileSystemHub.DirectoryChangedOperation, e.OldFullPath);
        }

        private void OnChanged(object sender, FileSystemEventArgs e)
        {
            if (_hostPlatform.WatchIgnore.Contains(e.Name))
            {
                return;
            }
            _hubContext.Clients.All.SendAsync(FileSystemHub.DirectoryChangedOperation, e.FullPath);
        }

        #region IDisposable Support
        private bool disposedValue; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing && _fileSystemWatcher != null)
                {
                    _fileSystemWatcher.Dispose();
                }
                disposedValue = true;
            }
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
