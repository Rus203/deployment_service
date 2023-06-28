import React from 'react'
import Projects from './projects.component'

const Component: React.FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <Projects hasAccess={hasAccess} />
}

export default Component