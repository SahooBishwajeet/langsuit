import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseFilterState {
  searchQuery: string;
}

const initialState: CourseFilterState = {
  searchQuery: "",
};

const courseFilterSlice = createSlice({
  name: "courseFilter",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = courseFilterSlice.actions;
export default courseFilterSlice.reducer;
