import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit'
import { Bootstrap, Picks, Stats, StatData, LiveEvent } from '../types'
import { getPastEvents, getPlayerAggregate, getTotalPoints, getTotalBenchPoints, getTotalRawPoints, getTotalSelections, getTotalStarts, getTotalBenched, getTotalCaptaincies, getSelectionStreak, getStartStreak, getBenchStreak, getNonBlankStreak, getTeamOfTheSeason } from '../utilities'
import { finishLoading, startLoading } from './loading'

const emptyAggregates = {
    totals: {
        redCards: 0,
        yellowCards: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        goalsConceded: 0,
        ownGoals: 0,
        saves: 0,
        minutes: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        timesInDreamteam: 0,
        bps: 0,
        bonus: 0,
        captaincies: 0,
        points: 0,
        rawPoints: 0,
        benchPoints: 0,
        selections: 0,
        starts: 0,
        benched: 0,
    },
    streaks: {
        selection: null,
        start: null,
        bench: null,
        nonBlank: null,
    },
}

const stats = createSlice({
    name: 'stats',
    initialState: {
        data: undefined,
        chips: undefined,
        tots: undefined,
    },
    reducers: {
        buildDataStart(state) {
            state.data = undefined
            state.chips = undefined
            state.tots = undefined
        },
        buildDataSuccess(state, action) {
            state.data = action.payload.data
            state.chips = action.payload.chips
            state.tots = action.payload.tots
        },
    },
})

export const { buildDataStart, buildDataSuccess } = stats.actions

const fetchPicks = async (event: number, entry: number): Promise<Picks> => {
    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/entry/${entry}/event/${event}/picks/`)}`)
    return await response.json()
}

const fetchEvent = async (event: number): Promise<LiveEvent> => {
    const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/event/${event}/live/`)}`)
    return await response.json()
}

const fetchGameweekInformation = async (event: number, entry: number): Promise<{ pick: Picks, live: LiveEvent }> => {
    const [ pick, live ] = await Promise.all([
        fetchPicks(event, entry),
        fetchEvent(event),
    ])

    return {
        pick,
        live,
    }
}

export const buildData = (bootstrap: Bootstrap, entry: number): ThunkAction<void, Bootstrap, unknown, Action<string>> => async dispatch => {
    dispatch(buildDataStart())
    dispatch(startLoading())

    const gameweeks = await Promise.all(
        getPastEvents(bootstrap.events).map(async event => await fetchGameweekInformation(event.id, entry))
    )

    const stats: { [key: number]: StatData } = {}
    const chips: { [key: number]: string } = {}

    gameweeks.forEach(gw => {
        if (gw.pick.active_chip) {
            chips[gw.pick.entry_history.event] = gw.pick.active_chip
        }

        gw.pick.picks.forEach(item => {
            if (!stats[item.element]) {
                stats[item.element] = {
                    element: bootstrap.elements.find(el => el.id === item.element)!,
                    data: bootstrap.events.filter(event => event.id < gw.pick.entry_history.event).map(event => ({
                        event,
                        multiplier: null,
                        points: null,
                        rawPoints: null,
                        stats: null,
                        position: null,
                    })),
                    aggregates: emptyAggregates,
                }
            }

            const points = gw.live.elements.find(el => el.id === item.element)?.stats.total_points || null

            stats[item.element] = {
                ...stats[item.element],
                data: [
                    ...stats[item.element].data,
                    {
                        event: bootstrap.events.find(event => event.id === gw.pick.entry_history.event)!,
                        multiplier: item.multiplier,
                        points: points !== null ? points * item.multiplier : points,
                        rawPoints: points,
                        stats: gw.live.elements.find(el => el.id === item.element)?.stats || null,
                        position: item.position,
                    }
                ],
            }
        })

        Object.keys(stats).forEach(player => {
            const index = Number(player)

            if (stats[index].data.length < gw.pick.entry_history.event) {
                stats[index] = {
                    ...stats[index],
                    data: [
                        ...stats[index].data,
                        {
                            event: bootstrap.events.find(event => event.id === gw.pick.entry_history.event)!,
                            multiplier: null,
                            points: null,
                            rawPoints: null,
                            stats: null,
                            position: null,
                        },
                    ],
                }
            }
        })
    })

    Object.keys(stats).forEach(id => {
        const player = stats[Number(id)]

        stats[Number(id)].aggregates = {
            totals: {
                redCards: getPlayerAggregate(player, 'red_cards'),
                yellowCards: getPlayerAggregate(player, 'yellow_cards'),
                goals: getPlayerAggregate(player, 'goals_scored'),
                assists: getPlayerAggregate(player, 'assists'),
                cleanSheets: getPlayerAggregate(player, 'clean_sheets'),
                goalsConceded: getPlayerAggregate(player, 'goals_conceded'),
                ownGoals: getPlayerAggregate(player, 'own_goals'),
                saves: getPlayerAggregate(player, 'saves'),
                minutes: getPlayerAggregate(player, 'minutes'),
                penaltiesMissed: getPlayerAggregate(player, 'penalties_missed'),
                penaltiesSaved: getPlayerAggregate(player, 'penalties_saved'),
                timesInDreamteam: getPlayerAggregate(player, 'in_dreamteam'),
                bps: getPlayerAggregate(player, 'bps'),
                bonus: getPlayerAggregate(player, 'bonus'),
                captaincies: getTotalCaptaincies(player),
                points: getTotalPoints(player),
                rawPoints: getTotalRawPoints(player),
                benchPoints: getTotalBenchPoints(player),
                selections: getTotalSelections(player),
                starts: getTotalStarts(player),
                benched: getTotalBenched(player),
            },
            streaks: {
                selection: getSelectionStreak(player),
                start: getStartStreak(player),
                bench: getBenchStreak(player),
                nonBlank: getNonBlankStreak(player),
            },
        }
    })

    const data = Object.values(stats).reduce((acc: Stats, curr) => ({
        ...acc,
        [curr.element.element_type]: [
            ...(acc[curr.element.element_type] || []),
            curr,
        ],
    }), {})

    dispatch(buildDataSuccess({
        data,
        chips,
        tots: getTeamOfTheSeason(data),
    }))
    dispatch(finishLoading())
}

export default stats.reducer