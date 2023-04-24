import { ReactNode } from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Link from '../../../../../Components/Link/LInk'
import themeConfig from '../../../../../configs/themeConfig'
import { Settings } from '../../../../context/settingsContext'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))


const VerticalNavHeader = (props: Props) => {
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props
  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 2 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' >
          <HeaderTitle variant='h6' sx={{ ml: 3 }}>
            Innowise
          </HeaderTitle>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
