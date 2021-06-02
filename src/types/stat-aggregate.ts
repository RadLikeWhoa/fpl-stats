import { StatAggregateStreaks } from './stat-aggregate-streaks'
import { StatAggregateTotals } from './stat-aggregate-totals'

export type StatAggregate = {
    totals: StatAggregateTotals
    streaks: StatAggregateStreaks
}
