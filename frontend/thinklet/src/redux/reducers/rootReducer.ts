import { type Action, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice"

import { type userResponseDto } from "../../interfaces/user";


interface RootState {
  user: { user: userResponseDto | null };

}


const appReducer = combineReducers({

    user:userReducer,

});

const rootReducer = (state: RootState | undefined, action: Action): RootState =>{
    if (action.type ===   "LOGOUT"){
        state = undefined;
    };

    return appReducer(state, action);
};

export default rootReducer; 