export const validateTeamId = (value: string) => {
    const number = Number(value)

    return value && !Number.isNaN(number) && Number.isInteger(number)
}
