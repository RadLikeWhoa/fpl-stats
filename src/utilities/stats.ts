import { ElementStats, StatData, Stats } from '../types'

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
    return statData.data.reduce((acc, pick) => acc + (pick.points || 0), 0)
}

export const getAllPlayers = (stats: Stats): StatData[] => {
    return Object.values(stats).reduce((acc, curr) => acc.concat(curr), [])
}

export const aggregateStats = (players: StatData[], key: keyof ElementStats) => players.map(player => ({
    player,
    [key]: player.data.reduce((acc, data) => {
        if (typeof data.stats?.[key] === 'number') {
            return ((data.stats?.[key] as number) || 0) + acc
        }

        if (typeof data.stats?.[key] === 'boolean') {
            return (+(data.stats?.[key] as boolean) || 0) + acc
        }

        return acc
    }, 0)
})).sort((a, b) => (b[key] as number) - (a[key] as number))

export const getTopStatAggregate = (players: StatData[], key: keyof ElementStats) => aggregateStats(players, key)[0]