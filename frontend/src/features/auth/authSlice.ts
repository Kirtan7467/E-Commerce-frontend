import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: 'admin' | 'user'| 'vendor' | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as 'admin' | 'user' | 'vendor' | null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; role: 'admin' | 'user' | 'vendor' }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
