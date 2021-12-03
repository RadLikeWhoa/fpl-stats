import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const STORAGE_VERSION = '2.1'

const isStale = () => localStorage.getItem('storageVersion') !== STORAGE_VERSION

export default function configureAppStore() {
    const storage = localStorage.getItem('applicationSettings')
    const recentTeams = localStorage.getItem('recentTeams')

    const mostRecentTeamId = recentTeams ? JSON.parse(recentTeams)?.[0].split(' — ')?.[0] : undefined
    const preloadedState = storage !== null && !isStale() ? JSON.parse(storage) : {}

    const store = configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware()],
        preloadedState: {
            settings: {
                theme: 'light',
                meanStrategy: 'average',
                hiddenSections: [],
                id: mostRecentTeamId ? Number(mostRecentTeamId) : undefined,
                range: {
                    start: 0,
                    end: 38,
                },
                ...preloadedState,
            },
        },
    })

    store.subscribe(() => {
        const state = store.getState().settings

        localStorage.setItem('storageVersion', STORAGE_VERSION)
        localStorage.setItem(
            'applicationSettings',
            JSON.stringify({
                theme: state.theme,
                meanStrategy: state.meanStrategy,
                hiddenSections: state.hiddenSections,
            })
        )
    })

    return store
}
