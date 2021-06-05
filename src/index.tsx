import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { Dashboard } from './components/Dashboard'
import configureAppStore from './store'
import reportWebVitals from './reportWebVitals'
import './index.scss'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={configureAppStore()}>
            <HashRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route path="/:team/">
                        <Dashboard />
                    </Route>
                    <Route path="/" exact>
                        <Dashboard />
                    </Route>
                </Switch>
            </HashRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

serviceWorker.unregister()

reportWebVitals()
