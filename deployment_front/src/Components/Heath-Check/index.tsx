import React from 'react'
import HealthCheck from './heath-check.component'

type IProp = {
  host: string,
}

const Component: React.FC<IProp> = ({ host }) => {
  return <HealthCheck host={host} />
}

export default Component