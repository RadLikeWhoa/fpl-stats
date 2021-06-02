import { ChipPlay } from './chip-play'
import { TopElementInfo } from './top-element-info'

export type Event = {
    average_entry_score: number
    chip_plays: ChipPlay[]
    data_checked: boolean
    deadline_time: string
    deadline_time_epoch: number
    deadline_time_game_offset: number
    finished: boolean
    highest_score: number
    highest_scoring_entry: number
    id: number
    is_current: boolean
    is_next: boolean
    is_previous: boolean
    most_captained: number
    most_selected: number
    most_transferred_in: number
    most_vice_captained: number
    name: string
    top_element: number
    top_element_info: TopElementInfo
    transfers_made: number
}
