/**
 * Student validation rules shared by the client form and the API routes,
 * so both sides enforce exactly the same constraints.
 */

export const STUDENT_FIELDS = ["name", "email", "phone", "department"];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Digits with optional leading "+", spaces, dashes, dots and parentheses.
export const PHONE_PATTERN = /^\+?[0-9\s\-().]+$/;
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

export const NAME_MIN_LENGTH = 2;
export const TEXT_MAX_LENGTH = 100;

export function isValidPhone(value) {
  if (!PHONE_PATTERN.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
}

/** Trim and normalise raw input into a clean student object. */
export function normalizeStudent(payload) {
  const read = (key) => (typeof payload?.[key] === "string" ? payload[key].trim() : "");

  return {
    name: read("name").replace(/\s+/g, " "),
    email: read("email").toLowerCase(),
    phone: read("phone"),
    department: read("department").replace(/\s+/g, " "),
  };
}

/**
 * Validate a student payload.
 * @returns {{ data: object, errors: Record<string, string>, isValid: boolean }}
 */
export function validateStudent(payload) {
  const data = normalizeStudent(payload);
  const errors = {};

  if (!data.name) errors.name = "Name is required.";
  else if (data.name.length < NAME_MIN_LENGTH)
    errors.name = `Name must be at least ${NAME_MIN_LENGTH} characters.`;
  else if (data.name.length > TEXT_MAX_LENGTH)
    errors.name = `Name must be at most ${TEXT_MAX_LENGTH} characters.`;

  if (!data.email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(data.email)) errors.email = "Enter a valid email address.";

  if (!data.phone) errors.phone = "Phone number is required.";
  else if (!isValidPhone(data.phone))
    errors.phone = `Enter a valid phone number (${PHONE_MIN_DIGITS}-${PHONE_MAX_DIGITS} digits).`;

  if (!data.department) errors.department = "Department is required.";
  else if (data.department.length > TEXT_MAX_LENGTH)
    errors.department = `Department must be at most ${TEXT_MAX_LENGTH} characters.`;

  return { data, errors, isValid: Object.keys(errors).length === 0 };
}
