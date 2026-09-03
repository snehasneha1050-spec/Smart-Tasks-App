import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  username: null,
  sessionToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const payload = action.payload || {};
      const username = typeof payload === 'string' ? payload : payload.username;
      const sessionToken = typeof payload === 'string' ? null : payload.sessionToken;

      state.isLoggedIn = Boolean(username);
      state.username = username || null;
      state.sessionToken = sessionToken || null;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.sessionToken = null;
    },
    setSessionToken: (state, action) => {
      state.sessionToken = action.payload || null;
    },
  },
});

export const { loginUser, logoutUser, setSessionToken } = userSlice.actions;
export default userSlice.reducer;