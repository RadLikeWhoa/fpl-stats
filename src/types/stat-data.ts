import { Element } from './element'
import { Event } from './event'

export type StatData = {
    element: Element
    data: {
        event: Event
        multiplier: number | null
    }[]
}