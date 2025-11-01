using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Logistics.Models
{
    public class Driver
    {
      
            public int DriverId { get; set; }
            public string Name { get; set; } = string.Empty;
            public bool IsAvailable { get; set; }
            public ICollection<Trip> Trips { get; set; } = new List<Trip>();


    }
}
