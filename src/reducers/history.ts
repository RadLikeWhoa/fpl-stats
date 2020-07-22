import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { History } from '../types'

const history = createSlice({
    name: 'history',
    initialState: {
        loading: true,
        data: undefined,
    },
    reducers: {
        fetchHistoryStart(state) {
            state.loading = true
            state.data = undefined
        },
        fetchHistorySuccess(state, action) {
            state.data = action.payload
            state.loading = false
        },
    },
})

export const { fetchHistoryStart, fetchHistorySuccess } = history.actions

export const fetchHistory = (entry: number): ThunkAction<void, History, unknown, Action<string>> => async dispatch => {
    dispatch(fetchHistoryStart())

    const response = await fetch('https://fpl-stats.herokuapp.com/', {
        headers: {
            'Target-URL': `https://fantasy.premierleague.com/api/entry/${entry}/history/`,
            'Authorization': '',
        },
    })

    const data = await response.json()

    dispatch(fetchHistorySuccess(data))
}

export default history.reducer