import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { Bootstrap, Picks, Stats, StatData } from '../types'
import { getPastEvents } from '../utilities'

const stats = createSlice({
    name: 'stats',
    initialState: {
        loading: true,
        data: undefined,
        chips: undefined,
    },
    reducers: {
        buildDataStart(state) {
            state.loading = true
            state.data = undefined
            state.chips = undefined
        },
        buildDataSuccess(state, action) {
            state.data = action.payload.data
            state.chips = action.payload.chips
            state.loading = false
        },
    },
})

export const { buildDataStart, buildDataSuccess } = stats.actions

const fetchPicks = async (event: number, entry: number): Promise<Picks> => {
    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${entry}/event/${event}/picks/`)}`)
    return await response.json()
}

export const buildData = (bootstrap: Bootstrap, entry: number): ThunkAction<void, Bootstrap, unknown, Action<string>> => async dispatch => {
    dispatch(buildDataStart())

    const picks = await Promise.all(
        getPastEvents(bootstrap.events).map(async event => await fetchPicks(event.id, entry))
    )

    const stats: { [key: number]: StatData } = {}
    const chips: { [key: number]: string } = {}

    picks.forEach(pick => {
        if (pick.active_chip) {
            chips[pick.entry_history.event] = pick.active_chip
        }

        pick.picks.forEach(item => {
            if (!stats[item.element]) {
                stats[item.element] = {
                    element: bootstrap.elements.find(el => el.id === item.element)!,
                    data: bootstrap.events.filter(event => event.id < pick.entry_history.event).map(event => ({
                        event,
                        multiplier: null,
                    })),
                }
            }

            stats[item.element] = {
                ...stats[item.element],
                data: [
                    ...stats[item.element].data,
                    {
                        event: bootstrap.events.find(event => event.id === pick.entry_history.event)!,
                        multiplier: item.multiplier,
                    }
                ]
            }
        })

        Object.keys(stats).forEach(player => {
            const index = Number(player)

            if (stats[index].data.length < pick.entry_history.event) {
                stats[index] = {
                    ...stats[index],
                    data: [
                        ...stats[index].data,
                        {
                            event: bootstrap.events.find(event => event.id === pick.entry_history.event)!,
                            multiplier: null,
                        },
                    ],
                }
            }
        })
    })

    dispatch(buildDataSuccess({
        data: Object.values(stats).reduce((acc: Stats, curr) => ({
            ...acc,
            [curr.element.element_type]: [
                ...(acc[curr.element.element_type] || []),
                curr,
            ],
        }), {}),
        chips,
    }))
}

export default stats.reducer