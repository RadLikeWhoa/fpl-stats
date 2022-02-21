export const fetchApi = async (endpoint: string): Promise<any> => {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(endpoint)}`)

    return JSON.parse((await response.json()).contents)
}
