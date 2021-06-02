import { Event } from '../types'

export const getPastEvents = (events: Event[]): Event[] => {
    const timestamp = Date.now()
    return events.filter(event => event.deadline_time_epoch * 1000 < timestamp)
}

export const getShortName = (event: Event): string => {
    return event.name.split(' ').pop() || ''
}
