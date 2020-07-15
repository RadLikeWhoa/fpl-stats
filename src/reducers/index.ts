import { combineReducers } from 'redux'
import bootstrap from './bootstrap'
import stats from './stats'
import settings from './settings'
import { Bootstrap, Stats } from '../types'

export type RootState = {
    bootstrap: {
        loading: boolean,
        data: Bootstrap | undefined,
    },
    stats: {
        loading: boolean,
        data: Stats | undefined,
        chips: {
            [key: number]: string,
        },
    },
    settings: {
        id: number | undefined,
        includeInactive: boolean,
    },
}

export default combineReducers({
    bootstrap,
    stats,
    settings,
})