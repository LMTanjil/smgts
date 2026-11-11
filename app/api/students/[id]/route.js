import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import { validateStudent } from "@/lib/validation";
import { fail, handleApiError, isValidObjectId, ok, readJson } from "@/lib/apiResponse";

const INVALID_ID = "Invalid student ID.";
const NOT_FOUND = "Student not found.";

// GET /api/students/[id] - fetch one student
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail(INVALID_ID, 400);

  try {
    await dbConnect();
    const student = await Student.findById(id);
    if (!student) return fail(NOT_FOUND, 404);
    return ok(student);
  } catch (error) {
    return handleApiError(error, "Unable to load student details right now.");
  }
}

// PUT /api/students/[id] - update a student
export async function PUT(request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail(INVALID_ID, 400);

  const body = await readJson(request);
  if (!body) return fail("Request body must be a valid JSON object.", 400);

  const { data, errors, isValid } = validateStudent(body);
  if (!isValid) return fail("Please correct the highlighted fields.", 400, errors);

  try {
    await dbConnect();
    const student = await Student.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!student) return fail(NOT_FOUND, 404);
    return ok(student, { message: "Student updated successfully." });
  } catch (error) {
    return handleApiError(error, "Unable to update student right now.");
  }
}

// DELETE /api/students/[id] - delete a student
export async function DELETE(_request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail(INVALID_ID, 400);

  try {
    await dbConnect();
    const student = await Student.findByIdAndDelete(id);
    if (!student) return fail(NOT_FOUND, 404);
    return ok({ _id: student._id }, { message: "Student deleted successfully." });
  } catch (error) {
    return handleApiError(error, "Unable to delete student right now.");
  }
}
