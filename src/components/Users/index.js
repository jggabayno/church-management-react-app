import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../states/users/actions'
import { fetchUserPositions } from '../../states/userPositions/actions'
import imageUpload from '../../states/imageupload/actions';
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
  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const { isLoading, data: users } = useSelector((state) => state.users)

  useEffect(() => {
    if (selectedUser && actionType === 'edit') setImage((prev) => [prev[0], selectedUser.photo])
  }, [selectedUser, actionType])

  const { isLoading: isLoadingUserPositions, data: userPositions } = useSelector(state => state.userpositions)

  useEffect(() => {
    dispatch(fetchUserPositions())
  }, [])

  const uploadImage = (info) => {
    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }

    if (info) {
      getBase64(info.file, (imageUrl) => (
        setImage([info.file, imageUrl]))
      );
    }
  }

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const onView = (user) => () => setConfig([true, 'view', user])

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, user) => {

        const src = user.photo ? (process.env.REACT_APP_API_USER_PHOTO + user.photo)
          : NoPhoto
        return (
          <div className='avatar-and-name'>
            <Avatar size={40} src={src} alt='user' />
            <span onClick={onView(user)} className='table-column-text-highlight'>{name}</span>
          </div>
        )
      }
    },
    {
      title: 'Position',
      dataIndex: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position)

    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_number',
      sorter: (a, b) => a.mobile_number.localeCompare(b.mobile_number)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <Tag className={`status-tag status-${status}`}>{status}</Tag>
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (created_at) => moment(created_at).format('LL')
    },
    {
      title: 'Actions',
      render: (_, row) => {

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
    const data = users.map(user => {

      function getPositionName(position_id) {
        if (position_id === 1) return 'Member'
        if (position_id === 2) return 'Worker'
        if (position_id === 3) return 'Leader'
        if (position_id === 4) return 'Pastor'
        if (!position_id) return 'N/A'
      }

      const addressInfo = [...user?.address]?.pop()
      const addressForCsv = addressInfo ?
        `${addressInfo.house_no} ${addressInfo.street} ${addressInfo.barangay} ${addressInfo.municipality}`
        : 'N/A'

      return {
        ...user, name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
        status: user.status ? 'Active' : 'In-Active',
        position: getPositionName(user.position_id),
        occupation: user.occupation || 'N/A',
        gender: user.gender === 1 ? 'Male' : 'Female',
        fathers_maiden_name: user.fathers_maiden_name || 'N/A',
        mothers_maiden_name: user.mothers_maiden_name || 'N/A',
        addressForCsv,
        user_type: user.user_type_id === 1 ? 'Admin' : user.user_type_id === 2 ? 'Staff' : 'N/A'
      }

    })

    function processData(users) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        users.filter((user) => toTrimStringLower(user.name)
          .includes(toTrimStringLower(searchKey)))
        : users
    }
    return processData(data)
  }

  function csv() {

    const hasData = dataSource().length

    const header = [['First Name', 'Middle Name', 'Last Name', 'Age', 'Citizenship', 'Birth Date', 'Gender',
      'Address', 'Mobile Number', 'Email', 'Place of Birth', 'Position', 'Status', 'User Type', 'Added By',
      'Date Created']]
    const body = hasData ?
      dataSource().map(({
        first_name,
        middle_name,
        last_name,
        age,
        citizenship,
        birth_date,
        gender,
        addressForCsv,
        mobile_number,
        email,
        place_of_birth,
        position,
        status,
        user_type,
        added_by,
        created_at
      }) =>
        Object.values({
          first_name,
          middle_name,
          last_name,
          age,
          citizenship,
          birth_date,
          gender,
          addressForCsv,
          mobile_number,
          email,
          place_of_birth,
          position,
          status,
          user_type,
          added_by, created_at: moment(created_at).format('LLLL')
        }))
      : [['', '', '', '', '', '', '', 'No Data Available', '', '', '', '', '', '', '', '']]

    return {
      filename: `members-${moment().format('LL')}.csv`,
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
    setImage([null, null])
  }

  const closeModal = () => {
    setConfig([false, null, null])
    form.resetFields()
    setImage([null, null])
  }

  const onEdit = (user) => () => {
    form.setFieldsValue({
      ...user,
      birth_date: moment(user.birth_date),
      house_no: user.address[0]?.house_no,
      street: user.address[0]?.street,
      barangay: user.address[0]?.barangay,
      municipality: user.address[0]?.municipality
    })
    setConfig([true, 'edit', user])
  }

  const verbsOptions = { message, form, setConfig, setImage }

  const confirmDelete = (user) => () => dispatch(deleteUser(user, verbsOptions))

  const onSubmit = async (user) => {
    user.birth_date = moment(user.birth_date).format('YYYY-MM-DD')
    user.age = moment().diff(moment(user.birth_date, 'YYYYMMDD'), 'years')

    const getImage = async (photo) => photo ? await imageUpload({ destination: 'user', photo }) : imageUrl

    if (actionType === 'add') {
      const photo = await getImage(imageUrl)

      dispatch(addUser({ ...user, photo }, verbsOptions))
    }
    if (actionType === 'edit') {

      const photo = await getImage(imageUrl?.includes('base64') ? imageUrl : '')

      dispatch(updateUser({ ...user, id: selectedUser.id, photo }, verbsOptions))
    }
  }

  return (
    <main className='users'>
      <h1 className='title'>Members</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />
      <Button className='btn-add-user' type='primary' onClick={openModal}>Add Member</Button>
      <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns }} className='users-table' />
      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        imageUrl={imageUrl}
        uploadImage={uploadImage}
        modalWidth={800}
        selectedUser={selectedUser}
        isLoadingUserPositions={isLoadingUserPositions}
        userPositions={userPositions}
      />}
    </main>
  )
}