import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import courseFilterReducer from "./filterSlice";
export const store = configureStore({
  reducer: {
    search: searchReducer,
    courseFilter: courseFilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
