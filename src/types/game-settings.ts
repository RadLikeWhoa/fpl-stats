export type GameSettings = {
    cup_qualifying_method: string
    cup_start_event_id: number
    cup_stop_event_id: number
    cup_type: string
    league_h2h_tiebreak_stats: string[]
    league_join_private_max: number
    league_join_public_max: number
    league_ko_first_instead_of_random: boolean
    league_max_ko_rounds_private_h2h: number
    league_max_size_private_h2h: number
    league_max_size_public_classic: number
    league_max_size_public_h2h: number
    league_points_h2h_draw: number
    league_points_h2h_lose: number
    league_points_h2h_win: number
    league_prefix_public: string
    squad_squadplay: number
    squad_squadsize: number
    squad_team_limit: number
    squad_total_spend: number
    stats_form_days: number
    sys_vice_captain_enabled: boolean
    timezone: string
    transfers_sell_on_fee: number
    ui_currency_multiplier: number
    ui_special_shirt_exclusions: number[]
    ui_use_special_shirts: boolean
}
