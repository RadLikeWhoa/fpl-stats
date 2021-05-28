import { Element } from './element'
import { ElementStats } from './element-stats'
import { Event } from './event'

export type StatData = {
    element: Element
    data: {
        event: Event
        multiplier: number | null
        points: number | null
        stats: ElementStats | null
    }[]
}