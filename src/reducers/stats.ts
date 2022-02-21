import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Bootstrap, Picks, LiveEvent } from '../types'
import { fetchApi, getPastEvents } from '../utilities'
import { finishLoading, startLoading } from './loading'

export const fetchStatData = createAsyncThunk(
    'stats/fetch',
    async (arg: { bootstrap: Bootstrap; entry: number }, thunkAPI) => {
        thunkAPI.dispatch(fetchStatsStart())
        thunkAPI.dispatch(startLoading())

        const gameweeks = await Promise.all(
            getPastEvents(arg.bootstrap.events).map(async event => await fetchGameweekInformation(event.id, arg.entry))
        )

        thunkAPI.dispatch(fetchStatsSuccess(gameweeks))
        thunkAPI.dispatch(finishLoading())
    }
)

const stats = createSlice({
    name: 'stats',
    initialState: {
        data: undefined,
    },
    reducers: {
        fetchStatsStart(state) {
            state.data = undefined
        },
        fetchStatsSuccess(state, action) {
            state.data = action.payload
        },
    },
})

export const { fetchStatsStart, fetchStatsSuccess } = stats.actions

const fetchPicks = async (event: number, entry: number): Promise<Picks> => {
    return await fetchApi(`entry/${entry}/event/${event}/picks/`)
}

const fetchEvent = async (event: number): Promise<LiveEvent> => {
    return await fetchApi(`event/${event}/live/`)
}

const fetchGameweekInformation = async (event: number, entry: number): Promise<{ pick: Picks; live: LiveEvent }> => {
    const [pick, live] = await Promise.all([fetchPicks(event, entry), fetchEvent(event)])

    return {
        pick,
        live,
    }
}

export default stats.reducer
