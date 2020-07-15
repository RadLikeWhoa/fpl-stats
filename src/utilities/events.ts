import { Event } from '../types'

export const getPastEvents = (events: Event[]) => {
    const timestamp = Date.now()
    return events.filter(event => event.deadline_time_epoch * 1000 < timestamp)
}