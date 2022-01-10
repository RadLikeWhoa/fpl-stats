import { Event } from './event'
import { ElementStats } from './element-stats'

export type StatDataGameweek = {
    event: Event
    multiplier: number | null
    points: number | null
    benchPoints: number | null
    bonusPoints: number | null
    rawPoints: number | null
    stats: ElementStats | null
    position: number | null
}
