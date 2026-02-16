import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null,
  username: string,
  avatar_id: string | null,
  bio: string,
  isLoading: boolean,
  isDragging: boolean
}

const initialState: UserState = {
  id: null,
  username: '',
  avatar_id: null,
  bio: '',
  isLoading: false,
  isDragging: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      const { id, username, avatar_id, bio } = action.payload;
      state.id = id;
      state.username = username;
      state.avatar_id = avatar_id;
      state.bio = bio;
    },
    clearUserData: (state) => {
      state.id = null;
      state.username = '';
      state.avatar_id = null;
      state.bio = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload
    }
  }
});

export const { setUserData, setLoading, setIsDragging } = userSlice.actions;
