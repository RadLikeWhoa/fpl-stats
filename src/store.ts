import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const isStale = () => {
    const latestFetch = localStorage.getItem('latestFetch')

    if (!latestFetch) {
        return false
    }

    const parsed = Number(latestFetch)

    return parsed + 86400000 < Date.now()
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
        } catch (e) {
            localStorage.removeItem('reduxState')
        }
    })

    return store
}
