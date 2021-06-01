import { head, reduce, sort } from './arrays'

export const thousandsSeparator = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const thousandsShorthand = (value: number): string => {
    return value > 999999 ? `${round(value / 1000000)}M` : value > 999 ? `${round(value / 1000, 0)}K` : `${value}`
}

export const sumNumbers = (series: number[]): number => {
    return reduce(series, el => el)
}

export const average = (series: number[]): number => {
    return series.length ? sumNumbers(series) / series.length : 0
}

export const median = (series: number[]): number => {
    const sorted = sort(series, el => el)
    const mid = Math.ceil(series.length / 2)

    if (sorted.length % 2 === 0) {
        return (sorted[mid] + sorted[mid + 1]) / 2
    }

    return sorted[mid - 1]
}

export const round = (value: number, precision: number = 1): string => {
    const formatted = value.toFixed(precision)

    if (/\.0+$/.test(formatted)) {
        return head(formatted.split('.')) || ''
    }

    return formatted
}