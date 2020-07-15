import { StatData } from '../types'

export const getTotalSelections = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier !== null).length
}

export const getTotalStarts = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier && pick.multiplier > 0).length
}

export const getTotalBenched = (statData: StatData): number => {
    return statData.data.filter(pick => pick.multiplier === 0).length
}