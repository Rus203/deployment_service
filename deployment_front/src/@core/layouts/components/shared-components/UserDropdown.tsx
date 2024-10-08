// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
// import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'


import LogoutVariant from 'mdi-material-ui/LogoutVariant'

import Link from '../../../../Components/Link/LInk'
import { logOut } from '../../../../store/Slices'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { capitalizeFirstLowercaseRest } from '../../../../utils/upper-first-letter'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const account = useAppSelector(state => state.auth?.account)
  const dispatch = useAppDispatch()



  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    setAnchorEl(null)
  }

  const handleLogout = (url?: string) => {
    setAnchorEl(null)
    dispatch(logOut());
  }

  return account === null ? null : (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={account.name}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt={account.name} src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{capitalizeFirstLowercaseRest(account.name)}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {capitalizeFirstLowercaseRest(account.email)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <Link href="/login">
          <MenuItem sx={{ py: 2 }} onClick={() => handleLogout('/login')}>
            <LogoutVariant />
            Logout
          </MenuItem>
        </Link>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
