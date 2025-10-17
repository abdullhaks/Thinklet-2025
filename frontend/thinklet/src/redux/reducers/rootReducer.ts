import { type Action, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";

import { type IUser } from "../../interfaces/user";

interface RootState {
  user: { user: IUser | null };
}

const appReducer = combineReducers({
  user: userReducer,
});

const rootReducer = (
  state: RootState | undefined,
  action: Action
): RootState => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
