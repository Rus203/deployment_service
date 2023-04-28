import React from 'react'
import MiniBackDashboard from './project-dashboard.component'

const Component: React.FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <MiniBackDashboard hasAccess={hasAccess} />
}

export default Component
