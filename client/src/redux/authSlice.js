import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userInfo: null,
  },
  reducers: {
    loginSuccess: (state,action) => {
      state.userInfo = action.payload
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null
      state.isLoggedIn = false;
    },
    addSymbol: (state, action) => {
      state.userInfo.user.interestedStocks = [...new Set([...state.userInfo.user.interestedStocks, action.payload])];
    }
  },
});

export const { loginSuccess, logout , updatePage , addSymbol} = authSlice.actions;

export default authSlice.reducer;
