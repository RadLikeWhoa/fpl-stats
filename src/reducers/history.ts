import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { finishLoading, startLoading } from './loading'

export const fetchHistory = createAsyncThunk('history/fetch', async (entry: number, thunkAPI) => {
    thunkAPI.dispatch(fetchHistoryStart())
    thunkAPI.dispatch(startLoading())

    const response = await fetch(
        `https://jsonp.afeld.me/?url=${encodeURIComponent(
            `https://fantasy.premierleague.com/api/entry/${entry}/history/`
        )}`
    )

    const data = await response.json()

    thunkAPI.dispatch(fetchHistorySuccess(data))
    thunkAPI.dispatch(finishLoading())
})

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

export default history.reducer
