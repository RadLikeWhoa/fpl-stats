const chips: { [key: string]: string } = {
    '3xc': 'TC',
    bboost: 'BB',
    freehit: 'FH',
    wildcard: 'WC',
}

export const getChipAbbreviation = (key: string): string | null => chips[key] || null