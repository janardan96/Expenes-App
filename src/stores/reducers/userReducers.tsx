import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
// import { RootState } from '@states/store';

interface ProfileState {
  name: string;
  mobile: string;
  email: string;
}

const initialState: ProfileState = {
  name: '',
  mobile: '',
  email: '',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.name = action.payload.name;
      state.mobile = action.payload.mobile;
      state.email = action.payload.email;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export const profile = (state: RootState) => state.profile;

export default profileSlice.reducer;
