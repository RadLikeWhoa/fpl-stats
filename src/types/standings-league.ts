export type StandingsLeague = {
    id: number
    name: string
    created: string
    closed: boolean
    max_entries: number | null
    league_type: string
    scoring: string
    admin_entry: number | null
    code_privacy: number
    has_cup: boolean
    cup_league: number | null
    rank: number | null
}
