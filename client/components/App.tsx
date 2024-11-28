import AddCapsulePage from '../Pages/AddCapsulePage.tsx'

import Nav from './Navigation/Nav'
import Dashboard from '../Pages/Dashboard'
import React from 'react'

function App() {
  return (
    <>
      <div className="app">
        <Nav />
        <Dashboard />
      </div>
    </>
  )
}

export default App
