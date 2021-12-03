import { combineReducers } from 'redux'
import { Bootstrap, History, Entry, Picks, LiveEvent, StandingsPlayer } from '../types'
import bootstrap from './bootstrap'
import stats from './stats'
import settings, { SettingsState } from './settings'
import entry from './entry'
import history from './history'
import loading from './loading'
import milestones from './milestones'

export type RootState = {
    loading: number
    bootstrap: {
        data: Bootstrap | undefined
    }
    stats: {
        data:
            | {
                  pick: Picks
                  live: LiveEvent
              }[]
            | undefined
    }
    settings: SettingsState
    history: {
        data: History | undefined
    }
    entry: {
        data: Entry | undefined
    }
    milestones: {
        data: StandingsPlayer[] | undefined
    }
}

export default combineReducers({
    loading,
    bootstrap,
    stats,
    settings,
    history,
    entry,
    milestones,
})
