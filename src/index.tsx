import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { Dashboard } from './components/Dashboard'
import configureAppStore from './store'
import './index.scss'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={configureAppStore()}>
            <BrowserRouter basename="/fpl-stats">
                <Switch>
                    <Route path="/:team/">
                        <Dashboard />
                    </Route>
                    <Route path="/" exact>
                        <Dashboard />
                    </Route>
                </Switch>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

serviceWorker.unregister()
