import { createSlice } from '@reduxjs/toolkit'

const loading = createSlice({
    name: 'loading',
    initialState: 0,
    reducers: {
        startLoading(state) {
            state += 1

            return state
        },
        finishLoading(state) {
            state -= 1

            return state
        },
    },
})

export const { startLoading, finishLoading } = loading.actions

export default loading.reducer