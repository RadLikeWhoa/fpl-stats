import { combineReducers } from 'redux'
import bootstrap from './bootstrap'
import stats from './stats'
import settings from './settings'
import { Bootstrap, Stats, History } from '../types'
import history from './history';

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
    history: {
        loading: boolean,
        data: History | undefined,
    },
}

export default combineReducers({
    bootstrap,
    stats,
    settings,
    history,
})