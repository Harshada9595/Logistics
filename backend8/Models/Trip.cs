using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Logistics.Models
{
    public class Trip
    {
        [Key]
        public int TripId { get; set; }

        [Required(ErrorMessage = "Destination is required.")]
        [StringLength(100)]
        public string Destination { get; set; } = string.Empty;

        [Required]
        [ForeignKey(nameof(Driver))]
        public int DriverId { get; set; }
        public Driver Driver { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Vehicle))]
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, In Progress, Completed, Cancelled

        [Required]
        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }
    }
}
