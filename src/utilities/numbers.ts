export const thousandsSeparator = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const thousandsShorthand = (value: number): string => {
    return value > 999999 ? `${round(value / 1000000)}M` : value > 999 ? `${round(value / 1000, 0)}K` : `${value}`
}

export const sumNumbers = (series: number[]): number => {
    return series.reduce((acc, curr) => acc + curr, 0)
}

export const average = (series: number[]): number => {
    return sumNumbers(series) / series.length
}

export const median = (series: number[]): number => {
    const sorted = sort(series)
    const mid = Math.ceil(series.length / 2)

    if (sorted.length % 2 === 0) {
        return (sorted[mid] + sorted[mid + 1]) / 2
    }

    return sorted[mid - 1]
}

export const sort = (series: number[], direction: 'asc' | 'desc' = 'desc'): number[] => {
    if (direction === 'asc') {
        return [ ...series ].sort((a, b) => a - b)
    }

    return [ ...series ].sort((a, b) => b - a)
}

export const round = (value: number, precision: number = 1): string => {
    const formatted = value.toFixed(precision)

    if (/\.0+$/.test(formatted)) {
        return formatted.split('.')[0]
    }

    return formatted
}