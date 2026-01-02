export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  otp:string;
}

export interface VendorRegisterRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  password: string;
  shopName:string;
  status:string;
}
