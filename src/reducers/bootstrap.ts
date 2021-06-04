import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchEntry } from './entry'
import { fetchHistory } from './history'
import { finishLoading, startLoading } from './loading'
import { fetchStatData } from './stats'

export const fetchBootstrap = createAsyncThunk('bootstrap/fetch', async (id: number, thunkAPI) => {
    thunkAPI.dispatch(fetchBootstrapStart())
    thunkAPI.dispatch(startLoading())

    const response = await fetch(
        `https://jsonp.afeld.me/?url=${encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/')}`
    )

    const data = await response.json()

    await Promise.all([
        thunkAPI.dispatch(fetchStatData({ bootstrap: data, entry: id })),
        thunkAPI.dispatch(fetchHistory(id)),
        thunkAPI.dispatch(fetchEntry(id)),
    ])

    thunkAPI.dispatch(finishLoading())
    thunkAPI.dispatch(fetchBootstrapSuccess(data))
})

const bootstrap = createSlice({
    name: 'bootstrap',
    initialState: {
        data: undefined,
        latestFetch: null,
    },
    reducers: {
        fetchBootstrapStart(state) {
            state.data = undefined
        },
        fetchBootstrapSuccess(state, action) {
            state.data = action.payload
            localStorage.setItem('latestFetch', `${Date.now()}`)
        },
    },
})

export const { fetchBootstrapStart, fetchBootstrapSuccess } = bootstrap.actions

export default bootstrap.reducer
