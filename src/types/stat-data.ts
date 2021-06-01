import { Element } from './element'
import { StatAggregate } from './stat-aggregate'
import { StatDataGameweek } from './stat-data-gameweek'

export type StatData = {
    element: Element
    data: StatDataGameweek[]
    aggregates: StatAggregate
}