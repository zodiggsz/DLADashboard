import { configureStore } from "@reduxjs/toolkit";
import appReducer from './app';
import userReducer from './user';
import programsReducer from './programs';
import interestsReducer from './interests';

const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    programs: programsReducer,
    interests: interestsReducer
  }
});

export default store;
