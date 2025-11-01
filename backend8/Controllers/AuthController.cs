using Logistics.Data;
using Logistics.Dto;
using Logistics.Models;
using Logistics.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Logistics.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LogisticsDbContext _context;
        private readonly JwtService _jwt;

        public AuthController(LogisticsDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Logistics.Dto.RegisterRequest req)
        {
            // Check if username already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
            if (existingUser != null)
                return BadRequest("Username already exists");

            // Hash the password before saving
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                PasswordHash = hashedPassword,
                RoleId = req.RoleId // or default role if you want
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Logistics.Dto.LoginRequest req)
        {
            // Find user by username (do not compare password here)
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == req.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            // Verify password using BCrypt
            bool isValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash ?? string.Empty);
            if (!isValid)
                return Unauthorized("Invalid username or password");

            var token = _jwt.GenerateToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                Role = user.Role?.RoleName ?? string.Empty,
                Username = user.Username
            });
        }
    }
}
