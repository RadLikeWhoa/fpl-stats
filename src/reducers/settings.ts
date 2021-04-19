import { createSlice } from '@reduxjs/toolkit'

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: localStorage.getItem('id') || undefined,
    },
    reducers: {
        setId(state, action) {
            state.id = action.payload

            if (state.id) {
                localStorage.setItem('id', state.id)
            }
        },
    },
})

export const { setId } = settings.actions

export default settings.reducer