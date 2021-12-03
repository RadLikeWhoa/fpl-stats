import {
    ElementStats,
    StatData,
    Stats,
    StatDataGameweek,
    Streak,
    Picks,
    LiveEvent,
    Bootstrap,
    Range,
    StatAggregateTotals,
} from '../types'
import { head, reduce, sort } from './arrays'
import { sumNumbers } from './numbers'

export const getTotalSelections = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier !== null).length
}

export const getTotalStarts = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier && pick.multiplier > 0).length
}

export const getTotalBenched = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier === 0).length
}

export const getTotalPoints = (statData: StatData): number => {
    return reduce(statData.data, el => el.points || 0)
}

export const getTotalCaptaincies = (statData: StatData): number => {
    return statData.data.filter(data => (data.multiplier || 0) > 1).length
}

export const getTotalRawPoints = (statData: StatData): number => {
    return reduce(statData.data, el => el.rawPoints || 0)
}

export const getTotalBenchPoints = (statData: StatData): number => {
    return reduce(statData.data, el => (el.multiplier === 0 ? el.rawPoints || 0 : 0))
}

export const getTotalDoubleDigitHauls = (statData: StatData): number => {
    return statData.data.filter(data => (data.rawPoints || 0) > 9).length
}

export const getAllPlayers = (stats: Stats): StatData[] => {
    return Object.values(stats).reduce((acc, curr) => acc.concat(curr), [])
}

export const getPlayerAggregate = (player: StatData, key: keyof ElementStats): number =>
    player.data.reduce((acc, data) => {
        if (typeof data.stats?.[key] === 'number') {
            return ((data.stats?.[key] as number) || 0) + acc
        }

        if (typeof data.stats?.[key] === 'boolean') {
            return (+(data.stats?.[key] as boolean) || 0) + acc
        }

        return acc
    }, 0)

export const getTopStatAggregate = (players: StatData[], key: keyof StatAggregateTotals): StatData | null =>
    head(sort(players, el => el.aggregates.totals[key]))

const getStreak = (
    statData: StatData,
    comparison: (gw: StatDataGameweek) => boolean,
    ignoreBlanks: boolean = false
): Streak[] | null => {
    const streaks = statData.data.reduce((acc, curr) => {
        if (comparison(curr)) {
            if (ignoreBlanks) {
                return [...acc.slice(0, acc.length - 1), (acc[acc.length - 1] || 0) + 1]
            }

            if (!acc.length || acc[acc.length - 1] === 0) {
                return [...acc, 1]
            }

            return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1]
        }

        return ignoreBlanks ? [...acc, ...(acc.length && acc[acc.length - 1] === 0 ? [0] : [0, 0])] : [...acc, 0]
    }, [] as number[])

    const max = Math.max(...streaks)

    if (max === 0) {
        return null
    }

    return streaks
        .map((length, index) => {
            if (length < 2) {
                return null
            }

            const start = sumNumbers(streaks.slice(0, index).map(streak => (streak > 0 ? streak : 1)))
            const end = start - 1 + length

            const points = (start === end ? statData.data : statData.data.slice(start, end + 1)).map(
                event => event.points || 0
            )

            return {
                start: statData.data[start].event,
                end: statData.data[end].event,
                length,
                points,
                totalPoints: sumNumbers(points),
            }
        })
        .filter(el => el !== null) as Streak[]
}

export const getSelectionStreak = (statData: StatData): Streak[] | null =>
    getStreak(statData, gw => gw.multiplier !== null, true)

export const getStartStreak = (statData: StatData): Streak[] | null =>
    getStreak(statData, gw => (gw.multiplier || 0) > 0, true)

export const getBenchStreak = (statData: StatData): Streak[] | null =>
    getStreak(statData, gw => gw.multiplier === 0, true)

export const getNonBlankStreak = (statData: StatData): Streak[] | null =>
    getStreak(statData, gw => (gw.rawPoints || 0) > 2)

export const getDoubleDigitHaulStreak = (statData: StatData): Streak[] | null =>
    getStreak(statData, gw => (gw.rawPoints || 0) > 9)

const MIN_GK = 1
const MAX_GK = 2

const MIN_DEF = 3
const MAX_DEF = 5

const MIN_MID = 2
const MAX_MID = 5

const MIN_FWD = 1
const MAX_FWD = 3

export const getTeamOfTheSeason = (stats: Stats): { xi: StatData[]; bench: StatData[] } => {
    const gk = sort(stats[1], el => el.aggregates.totals.points).slice(0, MAX_GK)
    const def = sort(stats[2], el => el.aggregates.totals.points).slice(0, MAX_DEF)
    const mid = sort(stats[3], el => el.aggregates.totals.points).slice(0, MAX_MID)
    const fwd = sort(stats[4], el => el.aggregates.totals.points).slice(0, MAX_FWD)

    const top = gk
        .slice(0, MIN_GK)
        .concat(def.slice(0, MIN_DEF))
        .concat(mid.slice(0, MIN_MID))
        .concat(fwd.slice(0, MIN_FWD))

    const rest = sort(
        def.slice(MIN_DEF).concat(mid.slice(MIN_MID)).concat(fwd.slice(MIN_FWD)),
        el => el.aggregates.totals.points
    )

    const xi = sort(top.concat(rest.slice(0, 4)), el => el.element.element_type, 'asc')
    const bench = gk.slice(MIN_GK).concat(sort(rest.slice(4), el => el.aggregates.totals.points, 'desc'))

    return {
        xi,
        bench,
    }
}

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
        doubleDigitHauls: 0,
    },
    streaks: {
        selection: null,
        start: null,
        bench: null,
        nonBlank: null,
        doubleDigitHaul: null,
    },
}

export const filterStatData = async (
    rawStats: {
        pick: Picks
        live: LiveEvent
    }[],
    bootstrap: Bootstrap,
    range: Range
): Promise<{
    data: Stats
    chips: {
        [key: number]: string
    }
    tots: {
        xi: StatData[]
        bench: StatData[]
    }
}> => {
    const stats: { [key: number]: StatData } = {}
    const chips: { [key: number]: string } = {}

    rawStats.slice(range.start, range.end + 1).forEach(gw => {
        if (gw.pick.active_chip) {
            chips[gw.pick.entry_history.event] = gw.pick.active_chip
        }

        gw.pick.picks.forEach(item => {
            if (!stats[item.element]) {
                stats[item.element] = {
                    element: bootstrap.elements.find(el => el.id === item.element)!,
                    data: bootstrap.events.slice(range.start, gw.pick.entry_history.event - 1).map(event => ({
                        event,
                        multiplier: null,
                        points: null,
                        rawPoints: null,
                        benchPoints: null,
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
                        benchPoints: item.multiplier === 0 ? points : 0,
                        stats: gw.live.elements.find(el => el.id === item.element)?.stats || null,
                        position: item.position,
                    },
                ],
            }
        })

        Object.keys(stats).forEach(player => {
            const index = Number(player)

            if (stats[index].data.length < gw.pick.entry_history.event - range.start) {
                stats[index] = {
                    ...stats[index],
                    data: [
                        ...stats[index].data,
                        {
                            event: bootstrap.events.find(event => event.id === gw.pick.entry_history.event)!,
                            multiplier: null,
                            points: null,
                            rawPoints: null,
                            benchPoints: null,
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
                doubleDigitHauls: getTotalDoubleDigitHauls(player),
            },
            streaks: {
                selection: getSelectionStreak(player),
                start: getStartStreak(player),
                bench: getBenchStreak(player),
                nonBlank: getNonBlankStreak(player),
                doubleDigitHaul: getDoubleDigitHaulStreak(player),
            },
        }
    })

    const data = Object.values(stats).reduce(
        (acc: Stats, curr) => ({
            ...acc,
            [curr.element.element_type]: [...(acc[curr.element.element_type] || []), curr],
        }),
        {}
    )

    return {
        data,
        chips,
        tots: getTeamOfTheSeason(data),
    }
}
