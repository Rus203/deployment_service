import { FC } from 'react'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Outlet } from 'react-router-dom'
import VerticalLayout from '../@core/layouts/VerticalLayout'
import { useSettings } from '../hooks/useSettings'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import VerticalNavItems from '../navigation/vertical'




const UserLayout: FC = () => {
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  return <VerticalLayout
    hidden={hidden}
    settings={settings}
    verticalNavItems={VerticalNavItems()}
    saveSettings={saveSettings}
    verticalAppBarContent={(
      props
    ) => (
      <VerticalAppBarContent
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        toggleNavVisibility={props.toggleNavVisibility}
      />
    )}
  >
    <Outlet />
  </VerticalLayout>


}

export default UserLayout
