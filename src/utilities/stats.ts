import { StatData, Stats } from '../types'

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