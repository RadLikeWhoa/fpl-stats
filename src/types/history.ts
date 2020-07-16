import { Chip } from './chip'
import { PastHistory } from './past-history'
import { CurrentHistory } from './current-history'

export type History = {
    current: CurrentHistory[]
    past: PastHistory[]
    chips: Chip[]
}