import React from 'react'
import { render } from 'react-dom'

import './css/style.css'

const App = () => <div>Hello React hello wery</div>

render(<App />, document.getElementById('react-root'))

if (module.hot) {
  module.hot.accept()
}
