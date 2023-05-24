import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Navigate } from 'react-router-dom';


const ProtectedComponent: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const accessToken = useAppSelector(state => state.auth.accessToken)
  return !accessToken ? <Navigate to="/login" replace /> :  <Component />
}

export default ProtectedComponent
