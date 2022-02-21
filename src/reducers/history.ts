import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchApi } from '../utilities'
import { finishLoading, startLoading } from './loading'

export const fetchHistory = createAsyncThunk('history/fetch', async (entry: number, thunkAPI) => {
    thunkAPI.dispatch(fetchHistoryStart())
    thunkAPI.dispatch(startLoading())

    const data = await fetchApi(`https://fantasy.premierleague.com/api/entry/${entry}/history/`)

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
