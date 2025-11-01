using Logistics.Models;
using Microsoft.EntityFrameworkCore;

namespace Logistics.Data
{
public class LogisticsDbContext : DbContext
    {
        public LogisticsDbContext(DbContextOptions<LogisticsDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Driver> Drivers => Set<Driver>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Trip> Trips => Set<Trip>();
    }

}

