// src/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};


const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.userData;
      state.error = null;
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const {
 
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
