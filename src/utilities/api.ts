export const fetchApi = async (endpoint: string): Promise<any> => {
    const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(`https://fantasy.premierleague.com/api/${endpoint}`)}`
    )

    return await response.json()
}
