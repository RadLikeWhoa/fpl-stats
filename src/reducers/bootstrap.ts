import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { Bootstrap } from '../types'

const bootstrap = createSlice({
    name: 'bootstrap',
    initialState: {
        loading: true,
        data: undefined,
    },
    reducers: {
        fetchBootstrapStart(state) {
            state.loading = true
        },
        fetchBootstrapSuccess(state, action) {
            state.data = action.payload
            state.loading = false
        },
    },
})

export const { fetchBootstrapStart, fetchBootstrapSuccess } = bootstrap.actions

export const fetchBootstrap = (): ThunkAction<void, Bootstrap, unknown, Action<string>> => async dispatch => {
    dispatch(fetchBootstrapStart())

    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/')}`)

    const data = await response.json()

    dispatch(fetchBootstrapSuccess(data))
}

export default bootstrap.reducer