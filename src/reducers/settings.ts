import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBootstrap } from './bootstrap'

export const fetchDataWithId = createAsyncThunk('settings/fetch', async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setId(id))
    thunkAPI.dispatch(fetchBootstrap(id))
})

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: undefined,
        meanStrategy: 'average',
        theme: 'light',
    },
    reducers: {
        setId(state, action) {
            state.id = action.payload
        },
        setMeanStrategy(state, action) {
            state.meanStrategy = action.payload
        },
        setTheme(state, action) {
            state.theme = action.payload
        },
    },
})

export const { setId, setMeanStrategy, setTheme } = settings.actions

export default settings.reducer
