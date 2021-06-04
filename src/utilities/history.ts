import { History, Range } from '../types'

export const filterHistoryData = async (history: History, range: Range): Promise<History> => {
    return {
        ...history,
        current: history.current.slice(range.start, range.end + 1),
    }
}
