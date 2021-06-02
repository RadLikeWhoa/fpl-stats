import { ElementStats, StatData, Stats, StatDataGameweek, Streak } from '../types'
import { StatAggregateTotals } from '../types/stat-aggregate-totals'
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
): Streak | null => {
    const streaks = statData.data.reduce((acc, curr) => {
        if (comparison(curr)) {
            if (ignoreBlanks) {
                return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1]
            }

            if (!acc.length || acc[acc.length - 1] === 0) {
                return [...acc, 1]
            }

            return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1]
        }

        return [...acc, 0]
    }, (ignoreBlanks ? [0] : []) as number[])

    const max = Math.max(...streaks)

    if (max === 0) {
        return null
    }

    const start =
        statData.data[sumNumbers(streaks.slice(0, streaks.indexOf(max)).map(streak => (streak > 0 ? streak : 1)))].event
    const end = statData.data[start.id - 2 + max].event

    const points = sumNumbers(statData.data.slice(start.id - 1, start.id - 1 + max).map(event => event.points || 0))

    return {
        start,
        end,
        length: max,
        points,
    }
}

export const getSelectionStreak = (statData: StatData): Streak | null =>
    getStreak(statData, gw => gw.multiplier !== null, true)

export const getStartStreak = (statData: StatData): Streak | null =>
    getStreak(statData, gw => (gw.multiplier || 0) > 0, true)

export const getBenchStreak = (statData: StatData): Streak | null =>
    getStreak(statData, gw => gw.multiplier === 0, true)

export const getNonBlankStreak = (statData: StatData): Streak | null =>
    getStreak(statData, gw => (gw.rawPoints || 0) > 2)

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
    const bench = sort(gk.slice(MIN_GK).concat(rest.slice(4)), el => el.element.element_type, 'asc')

    return {
        xi,
        bench,
    }
}
