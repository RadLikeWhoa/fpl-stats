import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { finishLoading, startLoading } from './loading'

export const fetchEntry = createAsyncThunk('entry/fetch', async (id: number, thunkAPI) => {
    thunkAPI.dispatch(fetchEntryStart())
    thunkAPI.dispatch(startLoading())

    const response = await fetch(
        `https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${id}/`)}`
    )

    const data = await response.json()

    thunkAPI.dispatch(fetchEntrySuccess(data))
    thunkAPI.dispatch(finishLoading())
})

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

export default entry.reducer
