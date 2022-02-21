import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Standings } from '../types'
import { fetchApi, head, last } from '../utilities'
import { finishLoading, startLoading } from './loading'

const OVERALL_ID = 314

const fetchStanding = async (page: number): Promise<Standings> => {
    return await fetchApi(
        `https://fantasy.premierleague.com/api/leagues-classic/${OVERALL_ID}/standings?page_standings=${page}`
    )
}

export const fetchMilestones = createAsyncThunk('milestones/fetch', async (arg: undefined, thunkAPI) => {
    thunkAPI.dispatch(fetchMilestonesStart())
    thunkAPI.dispatch(startLoading())

    const results = await Promise.all([
        fetchStanding(1),
        fetchStanding(20),
        fetchStanding(200),
        fetchStanding(2000),
        fetchStanding(20000),
    ])

    const data = results.map((standings, index) =>
        index === 0 ? head(standings.standings.results) : last(standings.standings.results)
    )

    thunkAPI.dispatch(fetchMilestonesSuccess(data))
    thunkAPI.dispatch(finishLoading())
})

const milestones = createSlice({
    name: 'milestones',
    initialState: {
        data: undefined,
    },
    reducers: {
        fetchMilestonesStart(state) {
            state.data = undefined
        },
        fetchMilestonesSuccess(state, action) {
            state.data = action.payload
        },
    },
})

export const { fetchMilestonesStart, fetchMilestonesSuccess } = milestones.actions

export default milestones.reducer
