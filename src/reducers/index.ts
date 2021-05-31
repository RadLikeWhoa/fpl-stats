import { combineReducers } from 'redux'
import bootstrap from './bootstrap'
import stats from './stats'
import settings from './settings'
import entry from './entry'
import { Bootstrap, Stats, History, Entry } from '../types'
import history from './history'

export type RootState = {
    bootstrap: {
        loading: boolean
        data: Bootstrap | undefined
    }
    stats: {
        loading: boolean
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
        loading: boolean
        data: History | undefined
    }
    entry: {
        loading: boolean
        data: Entry | undefined
    }
}

export default combineReducers({
    bootstrap,
    stats,
    settings,
    history,
    entry,
})