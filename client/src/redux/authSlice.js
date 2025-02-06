import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userInfo: null,
  },
  reducers: {
    loginSuccess: (state,action) => {
      console.log(action.payload)
      state.userInfo = action.payload
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null
      state.isLoggedIn = false;
    }
  },
});

export const { loginSuccess, logout , updatePage } = authSlice.actions;

export default authSlice.reducer;
