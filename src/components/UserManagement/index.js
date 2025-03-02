import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchUsers, updateUser} from '../../states/users/actions'
import FormModal from './FormModal'
import './index.scss'

import NoPhoto from '../../assets/images/no_photo.png'

import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'

import { CgSoftwareDownload } from "react-icons/cg";
import { CSVLink } from "react-csv";
import moment from 'moment';

import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Space from 'antd/lib/space'
import Avatar from 'antd/lib/avatar'
import Tag from 'antd/lib/tag'

export default function Users() {
 
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedUser] = config

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const {isLoading, data: users} = useSelector((state) => state.users)
 
  useEffect(() => {dispatch(fetchUsers())}, [dispatch])
  
  const onView = (user) => () =>  setConfig([true, 'view', user])

  const columns = [
      {
        title: '',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render:(name, user) => {
          const src = user.photo ? (process.env.REACT_APP_API_USER_PHOTO + user.photo) 
          : NoPhoto
          return (
            <div className='avatar-and-name'>
              <Avatar size={40} src={src} alt='user'/>
              <span onClick={onView(user)} className='table-column-text-highlight'>{name}</span>
            </div>
          )
        }
      },
      {
        title: 'Type',
        dataIndex: 'user_type',
        sorter: (a, b) => a.user_type.localeCompare(b.user_type)

      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email)
      },
      {
        title: 'Date Created',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL')
      },        
      {
        title: 'Actions',
        render: (_,row) => {
  
        const user = users.find((user) => user.id === row.id)

        return (
        <Space size="middle">
          <div onClick={onEdit(user)}>Edit</div>          
          <Popconfirm
            title={`Are you sure to delete ${user.first_name}?`}
            onConfirm={confirmDelete(user)}
            okText="Yes"
            cancelText="No"
          >
          Delete
          </Popconfirm>      
        </Space>
          )
        }
      }
  ]

  function dataSource() {
    const data = users.filter(user => user.user_type_id).map(user => {

      return {...user,name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
        status: user.status ? 'Active' : 'In-Active',
        user_type: user.user_type_id === 1 ? 'Admin' : user.user_type_id === 2 ? 'Staff' : 'N/A',
        added_by_name: `${user.user?.first_name} ${user.user?.last_name}`
      }

    })
    
    function  processData(users) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      users.filter((user) => toTrimStringLower(user.name)
      .includes(toTrimStringLower(searchKey))) 
      : users
    }
    return processData(data)
  }
 
  function csv(){

    const hasData = dataSource().length

    const header = [['First Name', 'Middle Name', 'Last Name', 'Email', 'Status', 'User Type', 'Added By',
    'Date Created']]
    const body = hasData ?
    dataSource()?.map(({
    first_name,
    middle_name,
    last_name,
    email,
    status,
    user_type,
    added_by_name,
    created_at
    }) => 
    Object.values({
      first_name,
      middle_name,
      last_name,
      email,
      status,
      user_type,
      added_by_name, created_at: moment(created_at).format('LLLL')}))
    : [[ '', '', '','No Data Available', '', '', '', '']]

    return {
      filename: `user-management-${moment().format('LL')}.csv`,
      data: [header, ...body]
    }
  }

  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }

  const openModal = () => {
    setConfig((prev) => [!prev[0], 'add', null])
    form.resetFields()
  }
  
  const closeModal = () => {
    setConfig([false, null, null])
    form.resetFields()
  }

  const onEdit = (user) => () => {
  form.setFieldsValue(user)
  setConfig([true, 'edit', user])
  }

  const verbsOptions = { message, form, setConfig, setImage: () => {}}
 
  const confirmDelete = (user) => () => {
    const matchedUser = users?.find(u => u.id === user.id)
    const params = {...matchedUser, ...matchedUser?.address?.[0],...user, actionType: 'delete', id: matchedUser?.id, user_type_id: null, password: null}
      dispatch(updateUser(params, verbsOptions))
  }

  const onSubmit = async (user) => {
    const matchedUser = users?.find(u => u.id === user.id)
    const params = {...matchedUser, ...matchedUser?.address?.[0],...user, actionType, id: matchedUser?.id}
    dispatch(updateUser(params, verbsOptions))
  }

  return (
    <main className='user-management'>
        <h1 className='title'>User Management</h1>
        <Button className='btn-export-light' type='primary' ghost>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
        </Button>
        <Search onSearch={onSearch}/>
        <Button className='btn-add-user' type='primary' onClick={openModal}>Create User Account</Button>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='users-table'/>
        {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        modalWidth={500}
        selectedUser={selectedUser}
        users={users}
      />}
    </main>
  )
}