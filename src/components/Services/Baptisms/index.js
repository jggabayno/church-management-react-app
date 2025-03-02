import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchBaptisms, addBaptism, updateBaptism } from '../../../states/baptisms/actions'
import { fetchUsers } from '../../../states/users/actions'
import { fetchServiceFee } from '../../../states/servicefee/actions'
import './index.scss'
import moment from 'moment';

import Form from 'antd/lib/form'
import message from 'antd/lib/message'

import FormModal from './FormModal'
import Button from '../../shared/Button'
import Table from '../../shared/Table'
import Search from '../../shared/Search'
import Avatar from 'antd/lib/avatar'
import Space from 'antd/lib/space'
import Descriptions from 'antd/lib/descriptions'

import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function Baptisms() {

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedBaptism] = config

  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const { isLoading: isLoadingBaptisms, data: baptisms } = useSelector((state) => state.baptisms)

  const { isLoading: isLoadingUsers, data: users } = useSelector((state) => state.users)
  const { isLoading: isLoadingServiceFee, data: serviceFee } = useSelector((state) => state.servicefee)

  const baptistMembers = baptisms.flatMap(({ person }) => [person.id])
  const validatedUsers = users.filter(user => !baptistMembers.includes(user.id))


  useEffect(() => { dispatch(fetchServiceFee()) }, [dispatch])
  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  useEffect(() => { dispatch(fetchBaptisms()) }, [dispatch])

  // STEPS TO PROCESS
  const processConfig = {
    requirements: 1,
    form: 2,
    payment: 3
  }

  const [baptismalProcess, setBaptismalProcess] = useState(processConfig.requirements)


  const onView = (user) => () => {

    setConfig([true, 'view', user])

    form.setFieldsValue({
      ...user,
      person_id: user.person_id,
      date_of_baptism: moment(user.date_of_baptism)
    })

  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'person_name',
      sorter: (a, b) => a.person_name.localeCompare(b.person_name),
      render: (person_name, user) => {
        return (
          <Descriptions title='' column={1} colon={false} className='baptism-description-column'>
            <Descriptions.Item label={<Avatar size={40} src={process.env.REACT_APP_API_USER_PHOTO + user.person.photo} alt='user' />} className='desc-label-photo'><span className='table-column-text-highlight'>{`${person_name}`}</span></Descriptions.Item>
          </Descriptions>
        )
      }
    },
    {
      title: 'Reference No',
      dataIndex: 'baptism_no',
      sorter: (a, b) => a.baptism_no.localeCompare(b.baptism_no)
    },
    {
      title: 'Pastor',
      dataIndex: 'pastor_name',
      sorter: (a, b) => a.pastor_name.localeCompare(b.pastor_name)
    },
    {
      title: 'Date of Application',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (created_at) => moment(created_at).format('LL')
    },
    {
      title: 'Date of Baptism',
      dataIndex: 'date_of_baptism',
      sorter: (a, b) => a.date_of_baptism.localeCompare(b.date_of_baptism),
      render: (date_of_baptism) => moment(date_of_baptism).format('LL')
    },
    {
      title: 'Actions',
      render: (_, row) => {

        const user = baptisms.find((baptism) => baptism.id === row.id)

        return (
          <Space size="middle" className='baptism-actions'>
            <div onClick={onView(user)}>View</div>
            <div onClick={onEdit(user)}>Edit</div>
          </Space>
        )
      }
    }
  ]

  function dataSource() {

    const definition = baptisms.map(baptism => {
      const { person, pastor } = baptism;

      return {
        ...baptism,
        person_name: `${person?.first_name} ${person?.last_name}`,
        pastor_name: `${pastor?.first_name} ${pastor?.last_name}`
      }
    })

    function processData(baptisms) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        baptisms.filter((baptism) => toTrimStringLower(baptism.baptism_no)
          .includes(toTrimStringLower(searchKey)))
        : baptisms
    }
    return processData(definition)
  }

  function csv() {
    const hasData = dataSource().length
    const header = [['Name', 'Reference No', 'Pastor Name', 'Date of application', 'Date of Baptism', 'Date Created']]
    const body = hasData ?
      dataSource().map(({ person_name, baptism_no, pastor_name, created_at, date_of_baptism }) =>
        Object.values({ person_name, baptism_no, pastor_name, date_of_application: moment(created_at).format('LLLL'), date_of_baptism: moment(date_of_baptism).format('LLLL') }))
      : [['', '', 'No Data Available', '', '', '']]

    return {
      filename: `baptisms-${moment().format('LL').toLocaleLowerCase()}.csv`,
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
    form.setFieldsValue({
      ...user,
      person_id: user.person_id,
      mothers_maiden_name: user?.person?.mothers_maiden_name,
      fathers_maiden_name: user?.person?.fathers_maiden_name,
      pastor_id: user.pastor_id,
      date_of_baptism: moment(user.date_of_baptism)
    })
    setConfig([true, 'edit', user])
  }

  const verbsOptions = { message, form, setConfig }

  const BAPTISM_SERVICE_FEE_ID = 2
  const matchedServiceFee = serviceFee?.find(row => row.id === BAPTISM_SERVICE_FEE_ID)

  const totalSumOfServiceFeeDetail = matchedServiceFee?.details && JSON.parse(matchedServiceFee?.details)
    .map((row, key) => Number(row[`value${key}`])).reduce((acc, cur) => acc + cur, 0)

  const onSubmit = async (baptism) => {
    baptism.date_of_baptism = moment(baptism.date_of_baptism).format('YYYY-MM-DD')

    baptism.service_fee_id = BAPTISM_SERVICE_FEE_ID
    baptism.service_fee_detail = matchedServiceFee?.details
    baptism.amount = totalSumOfServiceFeeDetail

    if (actionType === 'edit') {

      dispatch(updateBaptism({ ...baptism, id: selectedBaptism.id }, verbsOptions))

    }

    if (actionType === 'add') {

      if (processConfig.form === baptismalProcess) {

        setBaptismalProcess(prev => prev + 1)

      } else {

        dispatch(addBaptism(baptism, verbsOptions))

      }

    }

  }

  return (
    <main className='baptisms'>
      <h1 className='title'>Baptismal</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />
      <Button className='btn-add-baptism' type='primary' onClick={openModal}>New Baptism</Button>
      <Table className='baptism-table' attributes={{ dataSource, isLoading: isLoadingBaptisms, isSearching, columns }} />
      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoadingBaptisms}
        form={form}
        onSubmit={onSubmit}
        modalWidth={actionType === 'view' ? 900 : 700}
        selectedBaptism={selectedBaptism}
        isLoadingUsers={isLoadingUsers}
        users={users}
        validatedUsers={validatedUsers}
        serviceFee={serviceFee}
        processConfig={processConfig}
        baptismalProcess={baptismalProcess}
        setBaptismalProcess={setBaptismalProcess}
      />}
    </main>
  )
}