import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { Bootstrap } from '../types'
import { fetchBootstrap } from './bootstrap'

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

export const fetchDataWithId =
    (id: number): ThunkAction<void, Bootstrap, unknown, Action<string>> =>
    async dispatch => {
        dispatch(setId(id))
        dispatch(fetchBootstrap(id))
    }

export default settings.reducer
