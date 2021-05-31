import { Element } from './element'
import { ElementStats } from './element-stats'
import { Event } from './event'

export type StatData = {
    element: Element
    data: {
        event: Event
        multiplier: number | null
        points: number | null
        rawPoints: number | null
        stats: ElementStats | null
        position: number | null
    }[]
}