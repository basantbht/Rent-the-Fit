import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading:false,
    error:false,
}

const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.loading= false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser= null;
            state.error = false;
            state.loading = false;
        }
    }
})

export const {signInStart,signInSuccess,signInFailure,logout} = userSlice.actions;

export default userSlice.reducer;