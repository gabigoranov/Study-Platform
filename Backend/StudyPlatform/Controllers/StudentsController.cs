using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Students;
using StudyPlatform.Services.Users;

namespace StudyPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentsService _studentsService;

        /// <summary>
        /// Initializes a new instance of the StudentsController class with the specified students service.
        /// </summary>
        /// <param name="studentsService">The service used to manage and retrieve student data. Cannot be null.</param>
        public StudentsController(IStudentsService studentsService)
        {
            _studentsService = studentsService;
        }

        /// <summary>
        /// Updates a students's score by a specified amount.
        /// </summary>
        /// <returns>The updated student model.</returns>
        [HttpPatch("score")]
        [ProducesResponseType(typeof(StudentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateScore([FromBody] UpdateScoreViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            StudentDTO res = await _studentsService.UpdateScoreAsync(userId, model.ModifyScoreBy);
            return Ok(res);
        }
    }
}
