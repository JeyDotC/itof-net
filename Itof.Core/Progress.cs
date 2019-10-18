using System;
using System.Collections.Generic;
using System.Text;

namespace Itof.Core
{
    public struct Progress
    {
        public string Task { get; }

        public long CurrentProgress { get; }

        public long Total { get; }

        public decimal ProgressPercentage => Total != 0 ? CurrentProgress / Total : 0;

        public Progress(string task, long currentProgress, long total) : this()
        {
            Task = task;
            CurrentProgress = currentProgress;
            Total = total;
        }

        public Progress(long currentProgress, long total) : this(string.Empty, currentProgress, total)
        {
        }
    }
}
