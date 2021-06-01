import { Event } from './event'

export type Streak = {
    start: Event
    end: Event
    length: number
    points?: number
}