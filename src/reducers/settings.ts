import { createSlice } from '@reduxjs/toolkit'

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: localStorage.getItem('id') || undefined,
        meanStrategy: localStorage.getItem('meanStrategy') || 'average',
    },
    reducers: {
        setId(state, action) {
            state.id = action.payload

            if (state.id) {
                localStorage.setItem('id', state.id)
            }
        },
        setMeanStrategy(state, action) {
            state.meanStrategy = action.payload
            localStorage.setItem('meanStrategy', state.meanStrategy)
        }
    },
})

export const { setId, setMeanStrategy } = settings.actions

export default settings.reducer