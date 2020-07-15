import { createSlice } from '@reduxjs/toolkit'

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: localStorage.getItem('id') || undefined,
        includeInactive: false,
    },
    reducers: {
        setId(state, action) {
            state.id = action.payload

            if (state.id) {
                localStorage.setItem('id', state.id)
            }
        },
        toggleIncludeInactive(state) {
            state.includeInactive = !state.includeInactive
        },
    },
})

export const { setId, toggleIncludeInactive } = settings.actions

export default settings.reducer