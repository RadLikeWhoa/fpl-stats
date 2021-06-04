import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Bootstrap, Picks, LiveEvent } from '../types'
import { getPastEvents } from '../utilities'
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
    const response = await fetch(
        `https://jsonp.afeld.me/?url=${encodeURIComponent(
            `https://fantasy.premierleague.com/api/entry/${entry}/event/${event}/picks/`
        )}`
    )
    return await response.json()
}

const fetchEvent = async (event: number): Promise<LiveEvent> => {
    const response = await fetch(
        `https://jsonp.afeld.me/?url=${encodeURIComponent(
            `https://fantasy.premierleague.com/api/event/${event}/live/`
        )}`
    )
    return await response.json()
}

const fetchGameweekInformation = async (event: number, entry: number): Promise<{ pick: Picks; live: LiveEvent }> => {
    const [pick, live] = await Promise.all([fetchPicks(event, entry), fetchEvent(event)])

    return {
        pick,
        live,
    }
}

export default stats.reducer
