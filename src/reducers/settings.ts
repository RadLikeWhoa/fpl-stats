import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBootstrap } from './bootstrap'

export type SettingsState = {
    id: number | undefined
    meanStrategy: 'average' | 'median'
    theme: 'light' | 'dark'
    hiddenSections: string[]
}

export const fetchDataWithId = createAsyncThunk('settings/fetch', async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setId(id))
    thunkAPI.dispatch(fetchBootstrap(id))
})

const initialState: SettingsState = {
    id: undefined,
    meanStrategy: 'average',
    theme: 'light',
    hiddenSections: [],
}

const settings = createSlice({
    name: 'settings',
    initialState,
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
        addHiddenSection(state, action) {
            state.hiddenSections.push(action.payload)
        },
        removeHiddenSection(state, action) {
            state.hiddenSections = state.hiddenSections.filter(section => section !== action.payload)
        },
    },
})

export const { setId, setMeanStrategy, setTheme, addHiddenSection, removeHiddenSection } = settings.actions

export default settings.reducer
