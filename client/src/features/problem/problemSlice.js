import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { problemService } from './problemService';

const initialState = {
  problems: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Fetch problems
export const getProblems = createAsyncThunk('problems/getAll', async (_, thunkAPI) => {
  try {
    return await problemService.getProblems();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error fetching problems');
  }
});

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProblems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.problems = action.payload;
      })
      .addCase(getProblems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = problemSlice.actions;
export default problemSlice.reducer;
