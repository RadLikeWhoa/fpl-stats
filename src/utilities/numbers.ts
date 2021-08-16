import { head, reduce, sort } from './arrays'

export const thousandsSeparator = (value: number | string): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const thousandsShorthand = (value: number): string => {
    return value > 999999 ? `${round(value / 1000000)}M` : value > 999 ? `${round(value / 1000, 0)}K` : `${value}`
}

export const sumNumbers = (series: (number | null)[]): number => {
    return reduce(series, el => el || 0)
}

export const average = (series: (number | null)[]): number => {
    const filtered = series.filter(el => el !== null)

    return filtered.length ? sumNumbers(filtered) / filtered.length : 0
}

export const median = (series: (number | null)[]): number => {
    const filtered = series.filter(el => el !== null) as number[]
    const sorted = sort(filtered, el => el)
    const mid = Math.ceil(filtered.length / 2)

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
