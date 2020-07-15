import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { Dashboard } from './components/Dashboard'
import configureAppStore from './store'
import { Provider } from 'react-redux'
import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureAppStore()}>
      <Dashboard />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
