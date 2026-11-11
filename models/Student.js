import mongoose from "mongoose";
import {
  EMAIL_PATTERN,
  NAME_MIN_LENGTH,
  TEXT_MAX_LENGTH,
  isValidPhone,
} from "../lib/validation";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters.`],
      maxlength: [TEXT_MAX_LENGTH, `Name must be at most ${TEXT_MAX_LENGTH} characters.`],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // database-level unique index
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "Enter a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      validate: {
        validator: isValidPhone,
        message: "Enter a valid phone number.",
      },
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      maxlength: [TEXT_MAX_LENGTH, `Department must be at most ${TEXT_MAX_LENGTH} characters.`],
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);

// Reuse the compiled model across hot reloads in development.
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
