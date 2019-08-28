using System;
using System.IO;

namespace Itof.Core
{
    public struct Drive
    {
        public long AvailableFreeSpace
        {
            get;
        }

        public string DriveFormat
        {
            get;
        }

        public DriveType DriveType
        {
            get;
        }

        public bool IsReady
        {
            get;
        }

        public string Name
        {
            get;
        }

        public string RootDirectory
        {
            get;
        }

        public long TotalFreeSpace
        {
            get;
        }

        public long TotalSize
        {
            get;
        }

        public string VolumeLabel
        {
            get;
        }

        public Drive(
            long availableFreeSpace,
            string driveFormat,
            DriveType driveType,
            bool isReady,
            string name,
            string rootDirectory,
            long totalFreeSpace,
            long totalSize,
            string volumeLabel
            )
            : this()
        {
            AvailableFreeSpace = availableFreeSpace;
            DriveFormat = driveFormat;
            DriveType = driveType;
            IsReady =isReady;
            Name = name;
            RootDirectory = rootDirectory;
            TotalFreeSpace = totalFreeSpace;
            TotalSize = totalSize;
            VolumeLabel = volumeLabel;
        }

        public static Drive FromDriveInfo(DriveInfo info)
            => new Drive(info.AvailableFreeSpace, info.DriveFormat, info.DriveType, info.IsReady, info.Name, info.RootDirectory.FullName, info.TotalFreeSpace, info.TotalSize, info.VolumeLabel);
    }
}
