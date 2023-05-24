import React from 'react'
import ProtectedComponent from './protected-component.component'

const Component: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  return <ProtectedComponent component={Component} />
}

export default Component
