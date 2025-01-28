import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from 'react-toastify';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
}

export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {        
        try {
            const response = await axios.post('http://localhost:3000/api/users/', formData);
            return response;
        } catch (error) {
            return error;
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
    }
})

export const {  } = authSlice.actions
export default authSlice.reducer