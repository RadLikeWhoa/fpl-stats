import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { History } from '../types'

const entry = createSlice({
    name: 'entry',
    initialState: {
        loading: true,
        data: undefined,
    },
    reducers: {
        fetchEntryStart(state) {
            state.loading = true
            state.data = undefined
        },
        fetchEntrySuccess(state, action) {
            state.data = action.payload
            state.loading = false
        },
    },
})

export const { fetchEntryStart, fetchEntrySuccess } = entry.actions

export const fetchEntry = (id: number): ThunkAction<void, History, unknown, Action<string>> => async dispatch => {
    dispatch(fetchEntryStart())

    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${id}/`)}`)

    const data = await response.json()

    dispatch(fetchEntrySuccess(data))
}

export default entry.reducer