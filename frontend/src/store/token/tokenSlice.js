import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: ''
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state,action) =>{
            state.token = token.payload;
            localStorage.setItem('token',token);
        },
        removeToken: (state) => {
            state.token = '';
            localStorage.setItem('token', '')
        }
    },
})

export const {setToken,removeToken} = tokenSlice.actions;
export default tokenSlice.reducer