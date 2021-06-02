import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { History } from '../types'
import { finishLoading, startLoading } from './loading'

const entry = createSlice({
    name: 'entry',
    initialState: {
        data: undefined,
    },
    reducers: {
        fetchEntryStart(state) {
            state.data = undefined
        },
        fetchEntrySuccess(state, action) {
            state.data = action.payload
        },
    },
})

export const { fetchEntryStart, fetchEntrySuccess } = entry.actions

export const fetchEntry =
    (id: number): ThunkAction<void, History, unknown, Action<string>> =>
    async dispatch => {
        dispatch(fetchEntryStart())
        dispatch(startLoading())

        const response = await fetch(
            `https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${id}/`)}`
        )

        const data = await response.json()

        dispatch(fetchEntrySuccess(data))
        dispatch(finishLoading())
    }

export default entry.reducer
