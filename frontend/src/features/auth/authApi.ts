import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export interface VendorRegisterRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  password: string;
  shopName:string;
  status?:string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://e-commerce-backend-1-m0eh.onrender.com',
  }),
  endpoints: (builder) => ({
    // LOGIN
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: builder.mutation<any, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    // REGISTER
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: builder.mutation<any, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // FORGOT PASSWORD
   forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

  

    // RESET PASSWORD
     resetPassword: builder.mutation<
      {message:string},
      { email: string; otp: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

     // REGISTER
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vendor_register: builder.mutation<any, VendorRegisterRequest>({
      query: (body) => ({
        url: '/vendorAuth/register',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVendor_registerMutation,
} = authApi;
