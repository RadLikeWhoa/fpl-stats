import { combineReducers } from 'redux'
import { Bootstrap, Stats, History, Entry, StatData } from '../types'
import bootstrap from './bootstrap'
import stats from './stats'
import settings from './settings'
import entry from './entry'
import history from './history'
import loading from './loading'

export type RootState = {
    loading: number
    bootstrap: {
        data: Bootstrap | undefined
    }
    stats: {
        data: Stats | undefined
        chips:
            | {
                  [key: number]: string
              }
            | undefined
        tots:
            | {
                  xi: StatData[]
                  bench: StatData[]
              }
            | undefined
    }
    settings: {
        id: number | undefined
        meanStrategy: 'average' | 'median'
    }
    history: {
        data: History | undefined
    }
    entry: {
        data: Entry | undefined
    }
}

export default combineReducers({
    loading,
    bootstrap,
    stats,
    settings,
    history,
    entry,
})
