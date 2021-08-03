import { StandingsLeague } from './standings-league'
import { StandingsPlayer } from './standings-player'

export type Standings = {
    league: StandingsLeague
    new_entries: {
        has_next: boolean
        page: number
        results: StandingsPlayer[]
    }
    standings: {
        has_next: boolean
        page: number
        results: StandingsPlayer[]
    }
}
