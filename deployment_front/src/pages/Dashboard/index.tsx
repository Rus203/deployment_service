import React from 'react'
import Dashboard from './dashboard.component'

const Component: React.FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <Dashboard hasAccess={hasAccess} />
}

export default Component
