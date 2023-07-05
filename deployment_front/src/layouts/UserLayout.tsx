import { FC, Suspense } from 'react'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Outlet } from 'react-router-dom'
import VerticalLayout from '../@core/layouts/VerticalLayout'
import { useSettings } from '../hooks/useSettings'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import VerticalNavItems from '../navigation/vertical'
import Spinner from '../Components/Spinner/spinner.component'




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
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  </VerticalLayout>


}

export default UserLayout
