import mongoose from "mongoose";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s-]{7,15}$/;

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailPattern, "Please provide a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
      match: [phonePattern, "Please provide a valid phone number."],
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
