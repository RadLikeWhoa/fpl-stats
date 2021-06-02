import { AutomaticSub } from './automatic-sub'
import { EntryHistory } from './entry-history'
import { Pick } from './pick'

export type Picks = {
    active_chip: string | null
    automatic_subs: AutomaticSub[]
    entry_history: EntryHistory
    picks: Pick[]
}
