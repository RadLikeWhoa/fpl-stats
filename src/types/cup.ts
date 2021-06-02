import { CupTie } from './cup-tie'

export type Cup = {
    matches: CupTie[]
    status: {
        qualification_event: number
        qualification_numbers: number
        qualification_rank: number
        qualification_state: string
    }
    cup_league: number
}
