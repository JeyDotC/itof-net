using System;
using System.Collections.Generic;
using Itof.Core.Services;
using Microsoft.AspNetCore.StaticFiles;

namespace Itof.UI.Services
{
    public class AspNetMimeMapService : IMimeMapService
    {
        private const string DefaultMime = "application/octect-stream";
        private static IDictionary<string, string> _mimeMap = new FileExtensionContentTypeProvider().Mappings;

        public string GetMimeFromExtension(string extension)
        {
            _mimeMap.TryGetValue($".{extension}", out var mime);

            return mime ?? DefaultMime;
        }
    }
}
