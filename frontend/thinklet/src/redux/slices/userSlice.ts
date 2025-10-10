import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { userResponseDto } from '../../interfaces/user';

interface AuthState {
  user: userResponseDto | null;
}

const initialState: AuthState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ user: userResponseDto }>) => {
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<userResponseDto>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  }
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
