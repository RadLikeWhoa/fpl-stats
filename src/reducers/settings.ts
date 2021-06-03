import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { Bootstrap } from '../types'
import { fetchBootstrap } from './bootstrap'

const settings = createSlice({
    name: 'settings',
    initialState: {
        id: undefined,
        meanStrategy: 'average',
    },
    reducers: {
        setId(state, action) {
            state.id = action.payload
        },
        setMeanStrategy(state, action) {
            state.meanStrategy = action.payload
        },
    },
})

export const { setId, setMeanStrategy } = settings.actions

export const fetchDataWithId =
    (id: number): ThunkAction<void, Bootstrap, unknown, Action<string>> =>
    async dispatch => {
        dispatch(setId(id))
        dispatch(fetchBootstrap(id))
    }

export default settings.reducer
