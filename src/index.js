import React from 'react'
import { render } from 'react-dom'

import './css/style.css'

import App from './js/app'

render(<App />, document.getElementById('react-root'))

if (module.hot) {
  module.hot.accept(<App />, () =>
    window.addEventListener('message', (e) => console.clear())
  )
}
