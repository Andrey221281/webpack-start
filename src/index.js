import React from 'react'
import { render } from 'react-dom'

import './css/style.css'

import App from './js/app'

render(<App />, document.getElementById('react-root'))

if (module.hot) {
  // console.clear()
  module.hot.accept()
}
