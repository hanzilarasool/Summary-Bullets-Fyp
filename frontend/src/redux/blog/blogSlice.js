import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  searchTerm: "",
  searchGenres: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchGenres: (state, action) => {
      state.searchGenres = action.payload;
    },
    resetBlogState: () => {
      return initialState;
    },
  },
});

export const { setCurrentPage, setSearchTerm, setSearchGenres } =
  blogSlice.actions;

export default blogSlice.reducer;
