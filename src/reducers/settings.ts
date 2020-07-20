import { createSlice } from '@reduxjs/toolkit'

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: localStorage.getItem('id') || undefined,
        includeInactive: !!localStorage.getItem('includeInactive') || false,
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

            if (state.includeInactive) {
                localStorage.setItem('includeInactive', 'true')
            } else {
                localStorage.removeItem('includeInactive')
            }
        },
    },
})

export const { setId, toggleIncludeInactive } = settings.actions

export default settings.reducer