using Logistics.Data;
using Logistics.Dto;
using Logistics.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Logistics.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly LogisticsDbContext _context;

        public TripsController(LogisticsDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ✅ GET: api/Trips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null) return NotFound();
            return trip;
        }

        // ✅ GET: api/Trips/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetActiveTrips()
        {
            return await _context.Trips
                .Where(t => t.Status == "In Progress")
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ✅ GET: api/Trips/completed
        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetCompletedTrips()
        {
            return await _context.Trips
                .Where(t => t.Status == "Completed")
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ✅ GET: api/Trips/long
        [HttpGet("long")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetLongTrips()
        {
            return await _context.Trips
                .Where(t => EF.Functions.DateDiffHour(t.StartTime, t.EndTime ?? t.StartTime) > 8)
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ✅ PUT: api/Trips/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrip(int id, Trip trip)
        {
            if (id != trip.TripId) return BadRequest();

            _context.Entry(trip).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // ✅ POST: api/Trips
        [HttpPost]
        public async Task<ActionResult<Trip>> PostTrip(Trip trip)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (trip.DriverId == 0 || trip.VehicleId == 0)
                return BadRequest("Driver and Vehicle IDs must be selected.");

            // Ensure sensible defaults
            trip.Status ??= "Pending";
            trip.EndTime ??= trip.StartTime;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                // Update driver and vehicle availability
                var driver = await _context.Drivers.FindAsync(trip.DriverId);
                if (driver != null)
                    driver.IsAvailable = false;

                var vehicle = await _context.Vehicles.FindAsync(trip.VehicleId);
                if (vehicle != null)
                    vehicle.IsAvailable = false;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetTrip), new { id = trip.TripId }, trip);
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while creating the trip and updating availability.");
            }
        }


        // ✅ PATCH: api/Trips/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTripStatus(int id, [FromBody] string status)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();

            trip.Status = status;
            if (status == "Completed" || status == "Cancelled")
            {
                trip.EndTime = DateTime.Now;

                var driver = await _context.Drivers.FindAsync(trip.DriverId);
                if (driver != null) driver.IsAvailable = true;

                var vehicle = await _context.Vehicles.FindAsync(trip.VehicleId);
                if (vehicle != null) vehicle.IsAvailable = true;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Trips/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripExists(int id)
        {
            return _context.Trips.Any(e => e.TripId == id);
        }
    }
}
