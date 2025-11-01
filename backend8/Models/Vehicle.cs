using System.ComponentModel.DataAnnotations;

namespace Logistics.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string Model { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
