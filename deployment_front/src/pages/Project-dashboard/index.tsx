import React from 'react'
import ProjectDashboard from './project-dashboard.component';

const Component: React.FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <ProjectDashboard hasAccess={hasAccess} />
}

export default Component
