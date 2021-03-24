using ElectronNET.API;
using ElectronNET.API.Entities;
using Itof.Core;
using Itof.Core.Services;
using Itof.Host.Osx.Services;
using Itof.Host.Windows.Services;
using Itof.LocalFileSystem;
using Itof.UI.Hubs;
using Itof.UI.Services;
using Itof.UI.Services.ProcessLauncherInvokers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;

namespace Itof.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddControllers();
            services.AddSignalR();
            services.AddSingleton<IMimeMapService>(p => new AspNetMimeMapService());
            services.AddTransient<IFileSystemService>(p => new LocalFileSystemService(p.GetService<IMimeMapService>()));
            services.AddTransient<ISearchFilesService>(p => new LocalSearchFilesService(p.GetService<IMimeMapService>()));
            services.AddSingleton<FileSystemWatcherBridge>();
            services.AddSingleton(HostPlatform.FromCurrentPlatform());

            switch (Environment.OSVersion.Platform)
            {
                case PlatformID.Win32NT:
                    WindowsSpecificServices(services);
                    break;
                default:
                    UnixSpecificServices(services);
                    break;
            }
        }

        private static void WindowsSpecificServices(IServiceCollection services)
        {
            services.AddSingleton<IProcessLauncherInvoker, WindowsProcessLauncherInvoker>();
            services.AddSingleton<IApplicationCatalog, WindowsApplicationCatalog>();
        }

        private static void UnixSpecificServices(IServiceCollection services)
        {
            services.AddSingleton<IProcessLauncherInvoker, UnixProcessLauncherInvoker>();
            services.AddSingleton<IApplicationCatalog, OsxApplicationCatalog>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseEndpoints(routes =>
            {
                routes.MapHub<FileSystemHub>("/fileSystemHub");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            Task.Run(ConfigureElectron);
        }

        private async void ConfigureElectron()
        {
            var options = new BrowserWindowOptions
            {
                Show = false,
            };
            var mainWindow = await Electron.WindowManager.CreateWindowAsync(options);
            mainWindow.OnReadyToShow += () => mainWindow.Show();
            mainWindow.OnClosed += () =>
            {
                Electron.App.Exit(0);
                Environment.Exit(0);
            };
        }
    }
}
