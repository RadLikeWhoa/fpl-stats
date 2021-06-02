import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { fetchEntry } from './entry'
import { fetchHistory } from './history'
import { finishLoading, startLoading } from './loading'
import { buildData } from './stats'

const bootstrap = createSlice({
    name: 'bootstrap',
    initialState: {
        data: undefined,
    },
    reducers: {
        fetchBootstrapStart(state) {
            state.data = undefined
        },
        fetchBootstrapSuccess(state, action) {
            state.data = action.payload
        },
    },
})

export const { fetchBootstrapStart, fetchBootstrapSuccess } = bootstrap.actions

export const fetchBootstrap =
    (id: number): ThunkAction<void, any, unknown, Action<string>> =>
    async dispatch => {
        dispatch(fetchBootstrapStart())
        dispatch(startLoading())

        const response = await fetch(
            `https://jsonp.afeld.me/?url=${encodeURIComponent(
                'https://fantasy.premierleague.com/api/bootstrap-static/'
            )}`
        )

        const data = await response.json()

        dispatch(buildData(data, id))
        dispatch(fetchHistory(id))
        dispatch(fetchEntry(id))

        dispatch(fetchBootstrapSuccess(data))
        dispatch(finishLoading())
    }

export default bootstrap.reducer
