export const initialCaps = (value: string): string => `${value.charAt(0).toUpperCase()}${value.toLowerCase().slice(1)}`

export const pluralise = (value: number | string, singular: string, plural: string) => {
    const parsedValue = typeof value === 'number' ? value : Number(value.replace(/,/g, ''))

    return `${value} ${parsedValue === 1 ? singular : plural}`
}

export const getGWCountLabel = (value: number | string, verbose: boolean = false): string =>
    verbose ? pluralise(value, 'Gameweek', 'Gameweeks') : pluralise(value, 'GW', 'GWs')

export const getPointsLabel = (value: number | string): string => pluralise(value, 'pt', 'pts')

export const normaliseDiacritics = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
