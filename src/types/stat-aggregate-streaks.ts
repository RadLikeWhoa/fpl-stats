import { Streak } from './streak'

export type StatAggregateStreaks = {
    selection: Streak | null
    start: Streak | null
    bench: Streak | null
    nonBlank: Streak | null
    doubleDigitHaul: Streak | null
}
