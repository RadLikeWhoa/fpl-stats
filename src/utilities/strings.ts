export const initialCaps = (value: string): string => `${value.charAt(0).toUpperCase()}${value.toLowerCase().slice(1)}`

export const pluralise = (value: number | string, singular: string, plural: string) => {
    const parsedValue = typeof value === 'number' ? value : Number(value.replace(/,/g, ''))

    return `${value} ${parsedValue === 1 ? singular : plural}`
}

export const getGWCountLabel = (value: number | string): string => pluralise(value, 'GW', 'GWs')

export const getPointsLabel = (value: number | string): string => pluralise(value, 'pt', 'pts')
