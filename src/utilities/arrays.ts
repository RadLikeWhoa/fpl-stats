export const sort = <T>(series: T[], comparator: (element: T) => number, direction: 'asc' | 'desc' = 'desc'): T[] => {
    return [ ...series ].sort((a, b) => (comparator(a) - comparator(b)) * (direction === 'desc' ? -1 : 1))
}

export const head = <T>(series: T[]): T | null => {
    return series.length ? series[0] : null
}

export const last = <T>(series: T[]): T | null => {
    return series.length ? series[series.length - 1] : null
}

export const reduce = <T>(series: T[], extractor: (element: T) => number, initialValue: number = 0): number => {
    return series.reduce((acc, curr) => acc + extractor(curr), initialValue)
}