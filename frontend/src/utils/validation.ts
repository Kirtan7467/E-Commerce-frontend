import { toast } from "react-toastify";

// required fields
export const validateRequired = (...fields: string[]) => {
  for (const f of fields) {
    if (!f || f.trim() === "") {
      toast.error("All fields are required");
      return false;
    }
  }
  return true;
};

// email
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    toast.error("Enter valid email address");
    return false;
  }
  return true;
};

// contact number (India based)
export const validateContact = (phone: string) => {
  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(phone)) {
    toast.error("Enter valid 10 digit contact number");
    return false;
  }
  return true;
};

// password strength
export const validatePassword = (password: string) => {
  if (password.length < 8)
    return toast.error("Password must be minimum 8 characters");
  if (!/[A-Z]/.test(password))
    return toast.error("Include at least one uppercase letter");
  if (!/[0-9]/.test(password)) return toast.error("Include one number");
  if (!/[!@#$%^&*]/.test(password))
    return toast.error("Include one special character (!@#$%)");
  return true;
};

// image validation
export const validateImage = (file: File | null) => {
  if (!file) {
    toast.error("Please upload an image");
    return false;
  }

  const allow = ["image/png", "image/jpeg", "image/jpg"];
  if (!allow.includes(file.type)) {
    toast.error("Only PNG, JPG, JPEG Allowed!");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.warning("Image must be less than 5MB");
    return false;
  }

  return true;
};

//excel validations 
export const validateExcel = (file: File|null) => {
  if (!file) return toast.error("Please upload a file");

  const allowed = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  if (!allowed.includes(file.type)) {
    toast.error("Only Excel files allowed (.xls, .xlsx)");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.warning("Max file size allowed is 5MB");
    return false;
  }

  return true;
};
