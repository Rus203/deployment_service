import React from 'react'
import Graph from './graphs.component'

const Component: React.FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <Graph hasAccess={hasAccess} />
}

export default Component