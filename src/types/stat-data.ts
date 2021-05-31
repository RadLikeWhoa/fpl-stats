import { Element } from './element'
import { StatDataGameweek } from './stat-data-gameweek'

export type StatData = {
    element: Element
    data: StatDataGameweek[]
}