import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const STORAGE_VERSION = '1'

const isStale = () => {
    const latestFetch = localStorage.getItem('latestFetch')
    const storageVersion = localStorage.getItem('storageVersion')

    if (!latestFetch) {
        return false
    }

    const parsed = Number(latestFetch)

    return parsed + 86400000 < Date.now() || storageVersion !== STORAGE_VERSION
}

export default function configureAppStore() {
    const storage = localStorage.getItem('reduxState')
    const parsedStorage = storage ? JSON.parse(storage) : null

    const preloadedState =
        parsedStorage !== null
            ? !isStale()
                ? parsedStorage
                : {
                      settings: {
                          ...parsedStorage.settings,
                          id: undefined,
                      },
                  }
            : {}

    const store = configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware()],
        preloadedState: {
            ...preloadedState,
            loading: 0,
        },
    })

    store.subscribe(() => {
        const state = store.getState()

        try {
            localStorage.setItem('reduxState', JSON.stringify(state))
            localStorage.setItem('storageVersion', STORAGE_VERSION)
        } catch (e) {
            try {
                localStorage.setItem(
                    'reduxState',
                    JSON.stringify({
                        settings: {
                            ...state.settings,
                            id: undefined,
                        },
                    })
                )
            } catch (e) {
                localStorage.removeItem('reduxState')
            }
        }
    })

    return store
}
