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
    const preloadedState = storage !== null && !isStale() ? JSON.parse(storage) : {}

    const store = configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware()],
        preloadedState: {
            ...preloadedState,
            loading: 0,
        },
    })

    store.subscribe(() => {
        try {
            localStorage.setItem('reduxState', JSON.stringify(store.getState()))
            localStorage.setItem('storageVersion', STORAGE_VERSION)
        } catch (e) {
            localStorage.removeItem('reduxState')
        }
    })

    return store
}
