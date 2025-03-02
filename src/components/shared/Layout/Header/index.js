import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Avatar from 'antd/lib/avatar'
import './index.scss'
import { logout } from '../../../../states/auth/actions'
import { fetchProfile } from '../../../../states/profile/actions'

import { useNavigate } from "react-router-dom"
import { BiChevronDown } from "react-icons/bi";
import { CgMenuRight } from "react-icons/cg";
import { useEffect } from "react"

function UserDropdown(props) {
  const { navigate, onLogout, name } = props
  return (
    <Dropdown
      overlay={(
        <Menu>
          <Menu.Item key='profile' onClick={() => navigate('/profile')}>My Profile</Menu.Item>
          <Menu.Item key='logout' onClick={onLogout}>Logout</Menu.Item>
        </Menu>
      )}
      trigger={['click']}
    >
      <span onClick={e => e.preventDefault()} className='user-x-downicon'>
        <span>{name}</span>
        <BiChevronDown />
      </span>
    </Dropdown>
  )
}

export default function Header({ auth, screens }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const name = auth.isLoggedIn && (`${auth.loggedData?.user?.first_name} ${auth.loggedData?.user?.last_name}`)

  const onLogout = async () => dispatch(logout(navigate))

  const profile = useSelector(state => state.profile)
  useEffect(() => { dispatch(fetchProfile()) }, [])

  return (
    <header>
      <Link to='/' className='logo'>Church name</Link>
      {!screens.xs && <nav>
        <span className="user"><Avatar size={30} src={process.env.REACT_APP_API_USER_PHOTO + profile?.data?.photo} />
          {auth.isLoggedIn && <UserDropdown navigate={navigate} onLogout={onLogout} name={name} />}</span>
      </nav>}
      {screens.xs && <CgMenuRight className="menu" />}
    </header>
  )
}