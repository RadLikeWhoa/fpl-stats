import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { History } from '../types'
import { finishLoading, startLoading } from './loading'

const history = createSlice({
    name: 'history',
    initialState: {
        data: undefined,
    },
    reducers: {
        fetchHistoryStart(state) {
            state.data = undefined
        },
        fetchHistorySuccess(state, action) {
            state.data = action.payload
        },
    },
})

export const { fetchHistoryStart, fetchHistorySuccess } = history.actions

export const fetchHistory = (entry: number): ThunkAction<void, History, unknown, Action<string>> => async dispatch => {
    dispatch(fetchHistoryStart())
    dispatch(startLoading())

    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${entry}/history/`)}`)

    const data = await response.json()

    dispatch(fetchHistorySuccess(data))
    dispatch(finishLoading())
}

export default history.reducer