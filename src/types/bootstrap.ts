import { ElementStat } from './element-stat'
import { ElementType } from './element-type'
import { GameSettings } from './game-settings'
import { Phase } from './phase'
import { Team } from './team'
import { Event } from './event'
import { Element } from './element'

export type Bootstrap = {
    element_stats: ElementStat[]
    element_types: ElementType[]
    elements: Element[]
    events: Event[]
    game_settings: GameSettings
    phases: Phase[]
    teams: Team[]
}
