import { combineReducers } from 'redux'
import bootstrap from './bootstrap'
import stats from './stats'
import settings from './settings'
import entry from './entry'
import { Bootstrap, Stats, History, Entry } from '../types'
import history from './history'
import loading from './loading'

export type RootState = {
    loading: number
    bootstrap: {
        data: Bootstrap | undefined
    }
    stats: {
        data: Stats | undefined
        chips: {
            [key: number]: string
        } | undefined
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