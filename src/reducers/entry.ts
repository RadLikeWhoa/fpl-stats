import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Entry } from '../types'
import { fetchApi } from '../utilities'
import { finishLoading, startLoading } from './loading'

export const fetchEntry = createAsyncThunk('entry/fetch', async (id: number, thunkAPI) => {
    thunkAPI.dispatch(fetchEntryStart())
    thunkAPI.dispatch(startLoading())

    const data = await fetchApi(`https://fantasy.premierleague.com/api/entry/${id}/`)

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

            const recentTeams = JSON.parse(localStorage.getItem('recentTeams') || '[]') || []
            const entry = action.payload as Entry

            localStorage.setItem(
                'recentTeams',
                JSON.stringify(Array.from(new Set([`${entry.id} — ${entry.name}`, ...recentTeams])))
            )
        },
    },
})

export const { fetchEntryStart, fetchEntrySuccess } = entry.actions

export default entry.reducer
