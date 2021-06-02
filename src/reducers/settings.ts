import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { Bootstrap } from '../types'
import { fetchBootstrap } from './bootstrap'

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
            } else {
                localStorage.removeItem('id')
            }
        },
        setMeanStrategy(state, action) {
            state.meanStrategy = action.payload
            localStorage.setItem('meanStrategy', state.meanStrategy)
        }
    },
})

export const { setId, setMeanStrategy } = settings.actions

export const fetchDataWithId = (id: number): ThunkAction<void, Bootstrap, unknown, Action<string>> => async dispatch => {
    dispatch(setId(id))
    dispatch(fetchBootstrap(id))
}

export default settings.reducer