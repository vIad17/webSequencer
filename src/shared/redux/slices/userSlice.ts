import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  username: '',
  avatar_id: null,
  bio: '',
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
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
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUserData, clearUserData, setLoading, setError } =
  userSlice.actions;
