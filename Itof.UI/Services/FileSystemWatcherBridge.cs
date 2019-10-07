using System;
using System.IO;
using Itof.UI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Itof.UI.Services
{
    public class FileSystemWatcherBridge : IDisposable
    {
        private readonly IHubContext<FileSystemHub> _hubContext;

        private FileSystemWatcher _fileSystemWatcher;

        public FileSystemWatcherBridge(IHubContext<FileSystemHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void Watch(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return;
            }

            if (path.StartsWith("//"))
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
            _hubContext.Clients.All.SendAsync(FileSystemHub.DirectoryChangedOperation, e.FullPath);
        }

        private void OnChanged(object sender, FileSystemEventArgs e)
        {
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
