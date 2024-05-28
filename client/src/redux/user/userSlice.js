import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true,
                state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false,
                state.error = null
        },
        signInFailed: (state, action) => {
            state.error = action.payload,
                state.loading = false
        },
        updateStart: (state) => {
            state.loading = true,
                state.error = null
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false,
                state.error = null
        },
        updateFailed: (state, action) => {
            state.error = action.payload,
                state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true,
                state.error = null
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        },
        deleteUserFailed: (state, action) => {
            state.error = action.payload,
                state.loading = false
        },
        signOutStart: (state) => {
            state.loading = true,
                state.error = null
        },
        signOutSuccess: (state) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        },
        signOutFailed: (state, action) => {
            state.error = action.payload,
                state.loading = false
        },

    },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailed, updateStart, updateSuccess, updateFailed, deleteUserFailed, deleteUserSuccess, deleteUserStart, signOutStart, signOutSuccess, signOutFailed } = userSlice.actions

export default userSlice.reducer