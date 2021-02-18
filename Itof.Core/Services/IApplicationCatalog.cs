using System;
using System.Collections.Generic;

namespace Itof.Core.Services
{
    public interface IApplicationCatalog
    {
        public IEnumerable<ApplicationInfo> ListApps();
    }
}
