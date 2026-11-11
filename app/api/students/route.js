import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import { validateStudent } from "@/lib/validation";
import { fail, handleApiError, ok, readJson } from "@/lib/apiResponse";

// GET /api/students - list all students, newest first
export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({}).sort({ createdAt: -1 });
    return ok(students);
  } catch (error) {
    return handleApiError(error, "Unable to load students right now.");
  }
}

// POST /api/students - create a student
export async function POST(request) {
  const body = await readJson(request);
  if (!body) return fail("Request body must be a valid JSON object.", 400);

  const { data, errors, isValid } = validateStudent(body);
  if (!isValid) return fail("Please correct the highlighted fields.", 400, errors);

  try {
    await dbConnect();
    const student = await Student.create(data);
    return ok(student, { message: "Student created successfully.", status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to create student right now.");
  }
}
