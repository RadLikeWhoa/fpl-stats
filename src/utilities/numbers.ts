export const thousandsSeparator = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const thousandsShorthand = (value: number): string => {
    return value > 999999 ? `${(value / 1000000).toFixed(0)}M` : value > 999 ? `${(value / 1000).toFixed(0)}K` : `${value}`
}