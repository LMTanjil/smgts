import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbConnect";
import Student from "../../../../models/Student";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s-]{7,15}$/;

function validateStudentPayload(payload) {
  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim().toLowerCase();
  const phone = String(payload?.phone || "").trim();
  const department = String(payload?.department || "").trim();

  const errors = [];

  if (!name) errors.push("Name is required.");
  if (!email) errors.push("Email is required.");
  else if (!emailPattern.test(email)) errors.push("Please provide a valid email address.");

  if (!phone) errors.push("Phone is required.");
  else if (!phonePattern.test(phone)) errors.push("Please provide a valid phone number.");

  if (!department) errors.push("Department is required.");

  return {
    isValid: errors.length === 0,
    data: { name, email, phone, department },
    message: errors.join(" "),
  };
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ success: false, message: "Invalid student ID." }, { status: 400 });
    }

    await dbConnect();
    const student = await Student.findById(id);

    if (!student) {
      return Response.json({ success: false, message: "Student not found." }, { status: 404 });
    }

    return Response.json({ success: true, data: student });
  } catch {
    return Response.json({ success: false, message: "Unable to load student details." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ success: false, message: "Invalid student ID." }, { status: 400 });
    }

    await dbConnect();
    const payload = await request.json();
    const validation = validateStudentPayload(payload);

    if (!validation.isValid) {
      return Response.json({ success: false, message: validation.message }, { status: 400 });
    }

    const student = await Student.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return Response.json({ success: false, message: "Student not found." }, { status: 404 });
    }

    return Response.json({ success: true, message: "Student updated successfully.", data: student });
  } catch (error) {
    if (error?.code === 11000) {
      return Response.json({ success: false, message: "A student with this email already exists." }, { status: 409 });
    }

    return Response.json({ success: false, message: "Unable to update student right now." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ success: false, message: "Invalid student ID." }, { status: 400 });
    }

    await dbConnect();
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return Response.json({ success: false, message: "Student not found." }, { status: 404 });
    }

    return Response.json({ success: true, message: "Student deleted successfully." });
  } catch {
    return Response.json({ success: false, message: "Unable to delete student right now." }, { status: 500 });
  }
}
