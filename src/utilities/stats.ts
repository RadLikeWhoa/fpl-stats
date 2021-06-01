import { ElementStats, Event, StatData, Stats, StatDataGameweek } from '../types'
import { head, reduce, sort } from './arrays'
import { sumNumbers } from './numbers'

export type Streak = {
    start: Event
    end: Event
    length: number
    points?: number
}

export type AggregateStat = {
    player: StatData
    value: number
}

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

export const getTotalRawPoints = (statData: StatData): number => {
    return reduce(statData.data, el => el.rawPoints || 0)
}

export const getTotalBenchPoints = (statData: StatData): number => {
    return reduce(statData.data, el => el.multiplier === 0 ? (el.rawPoints || 0) : 0)
}

export const getAllPlayers = (stats: Stats): StatData[] => {
    return Object.values(stats).reduce((acc, curr) => acc.concat(curr), [])
}

export const aggregateStats = (players: StatData[], key: keyof ElementStats): AggregateStat[] => sort(players.map(player => ({
    player,
    value: player.data.reduce((acc, data) => {
        if (typeof data.stats?.[key] === 'number') {
            return ((data.stats?.[key] as number) || 0) + acc
        }

        if (typeof data.stats?.[key] === 'boolean') {
            return (+(data.stats?.[key] as boolean) || 0) + acc
        }

        return acc
    }, 0)
})), el => el.value)

export const getTopStatAggregate = (players: StatData[], key: keyof ElementStats): AggregateStat | null => head(aggregateStats(players, key))

const getStreak = (statData: StatData, comparison: (gw: StatDataGameweek) => boolean, ignoreBlanks: boolean = false): Streak | null => {
    const streaks = statData.data.reduce((acc, curr) => {
        if (comparison(curr)) {
            if (ignoreBlanks) {
                return [ ...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1 ]
            }

            if (!acc.length || acc[acc.length - 1] === 0) {
                return [ ...acc, 1 ]
            }

            return [ ...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1 ]
        }

        return [ ...acc, 0 ]
    }, (ignoreBlanks ? [ 0 ] : []) as number[])

    const max = Math.max(...streaks)

    if (max === 0) {
        return null
    }

    const start = statData.data[sumNumbers(streaks.slice(0, streaks.indexOf(max)).map(streak => streak > 0 ? streak : 1))].event
    const end = statData.data[start.id - 2 + max].event

    const points = sumNumbers(statData.data
        .slice(start.id - 1, start.id - 1 + max)
        .map(event => event.points || 0))

    return {
        start,
        end,
        length: max,
        points,
    }
}

export const getSelectionStreak = (statData: StatData): Streak | null => getStreak(statData, (gw) => gw.multiplier !== null, true)

export const getStartStreak = (statData: StatData): Streak | null => getStreak(statData, (gw) => (gw.multiplier || 0) > 0, true)

export const getBenchStreak = (statData: StatData): Streak | null => getStreak(statData, (gw) => gw.multiplier === 0, true)

export const getNonBlankStreak = (statData: StatData): Streak | null => getStreak(statData, (gw) => (gw.rawPoints || 0) > 2)