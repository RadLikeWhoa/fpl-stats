import { Cup } from './cup'
import { League } from './league'

export type Entry = {
    id: number
    joined_time: string
    started_event: number
    favourite_team: number
    player_first_name: string
    player_last_name: string
    player_region_id: number
    player_region_name: string
    player_region_iso_code_short: string
    player_region_iso_code_long: string
    summary_overall_points: number
    summary_overall_rank: number
    summary_event_points: number
    summary_event_rank: number
    current_event: number
    name: string
    kit: string
    last_deadline_bank: number
    last_deadline_value: number
    last_deadline_total_transfers: number
    leagues: {
        classic: League[]
        h2h: League[]
        cup: Cup
    }
}
