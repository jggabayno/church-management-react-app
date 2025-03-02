import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeddings, addWedding, updateWedding } from '../../../states/weddings/actions'
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

export default function Weddings() {

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedWedding] = config
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const { isLoading: isLoadingWeddings, data: weddings } = useSelector((state) => state.weddings)
  const { isLoading: isLoadingUsers, data: users } = useSelector((state) => state.users)
  const { isLoading: isLoadingServiceFee, data: serviceFee } = useSelector((state) => state.servicefee)
  const auth = useSelector(state => state.auth)

  const marriedMembers = weddings.flatMap(({ bride, groom }) => [bride.id, groom.id])
  const validatedUsers = users.filter(user => !marriedMembers.includes(user.id))

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])
  useEffect(() => { dispatch(fetchServiceFee()) }, [dispatch])
  useEffect(() => { dispatch(fetchWeddings()) }, [dispatch])


  // STEPS TO PROCESS
  const processConfig = {
    requirements: 1,
    form: 2,
    payment: 3
  }

  const [weddingProcess, setWeddingProcess] = useState(processConfig.requirements)


  const onView = (user) => () => {

    setConfig([true, 'view', user])
    form.setFieldsValue({
      ...user,
      groom_id: user.groom_id,
      bride_id: user.bride_id,
      pastor_id: user.pastor_id,
      location: user.location,
      date_of_seminar: moment(user.date_of_seminar),
      date_schedule_of_marriage: moment(user.date_schedule_of_marriage)
    })
  }

  const weddingColumns = [
    {
      title: 'Couple',
      dataIndex: 'couple_name',
      sorter: (a, b) => a.couple_name.localeCompare(b.couple_name),
      render: (couple_name, user) => {
        return (
          <Descriptions title='' column={1} colon={false} className='couple-description-column'>
            <Descriptions.Item label={<Avatar size={40} src={process.env.REACT_APP_API_USER_PHOTO + user.groom.photo} alt='user' />} className='desc-label-photo'><span className='table-column-text-highlight'>{`${user.groom.first_name} ${user.groom.last_name}`}</span></Descriptions.Item>
            <Descriptions.Item label={<Avatar size={40} src={process.env.REACT_APP_API_USER_PHOTO + user.bride.photo} alt='user' />} className='desc-label-photo'><span className='table-column-text-highlight'>{`${user.bride.first_name} ${user.bride.last_name}`}</span></Descriptions.Item>
          </Descriptions>
          // <div>
          //    <span onClick={onView(user)}  className='table-column-text-highlight'>{couple_name}</span>
          // </div>
        )
      }
    },
    {
      title: 'Reference No',
      dataIndex: 'wedding_no',
      sorter: (a, b) => a.wedding_no.localeCompare(b.wedding_no)
    },
    {
      title: 'Pastor',
      dataIndex: 'pastor_name',
      sorter: (a, b) => a.pastor_name.localeCompare(b.pastor_name)
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location)
    },
    {
      title: 'Date of Seminar',
      dataIndex: 'date_of_seminar',
      sorter: (a, b) => a.date_of_seminar.localeCompare(b.date_of_seminar),
      render: (date_of_seminar) => moment(date_of_seminar).format('LL')
    },
    {
      title: 'Date Schedule of Marriage',
      dataIndex: 'date_schedule_of_marriage',
      sorter: (a, b) => a.date_schedule_of_marriage.localeCompare(b.date_schedule_of_marriage),
      render: (date_schedule_of_marriage) => moment(date_schedule_of_marriage).format('LL')
    },
    {
      title: 'Actions',
      render: (_, row) => {

        const user = weddings.find((wedding) => wedding.id === row.id)

        return (
          <Space size="middle" className='wedding-actions'>
            <div onClick={onView(user)}>View</div>
            <div onClick={onEdit(user)}>Edit</div>
          </Space>
        )
      }
    }
  ]

  function dataSource() {

    const definition = weddings.map(wedding => {
      const { bride, groom, pastor } = wedding;

      return {
        ...wedding,
        couple_name: `${bride?.first_name} ${bride?.last_name} - ${groom?.first_name} ${groom?.last_name}`,
        pastor_name: `${pastor?.first_name} ${pastor?.last_name}`
      }
    })

    function processData(weddings) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        weddings.filter((wedding) => toTrimStringLower(wedding.wedding_no)
          .includes(toTrimStringLower(searchKey)))
        : weddings
    }
    return processData(definition)
  }

  function csv() {
    const hasData = dataSource().length
    const header = [['Couple Name', 'Reference No', 'Pastor Name', 'Location', 'Date of Seminar', 'Date of Marriage', 'Date Created']]
    const body = hasData ?
      dataSource().map(({ couple_name, wedding_no, pastor_name, location, date_of_seminar, date_schedule_of_marriage, created_at }) =>
        Object.values({
          couple_name, wedding_no, pastor_name, location, date_of_seminar: moment(date_of_seminar).format('LLLL'),
          date_schedule_of_marriage: moment(date_schedule_of_marriage).format('LLLL'),
          created_at: moment(created_at).format('LLLL')
        }))
      : [['', '', '', 'No Data Available', '', '', '']]

    return {
      filename: `weddings-${moment().format('LL').toLocaleLowerCase()}.csv`,
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
    setWeddingProcess(1)
  }

  const onEdit = (user) => () => {

    form.setFieldsValue({
      ...user,
      groom_id: user.groom_id,
      bride_id: user.bride_id,
      groom_mothers_maiden_name: user.groom?.mothers_maiden_name,
      groom_fathers_maiden_name: user.groom?.fathers_maiden_name,
      groom_occupation: user.groom?.occupation,
      bride_mothers_maiden_name: user.bride?.mothers_maiden_name,
      bride_fathers_maiden_name: user.bride?.fathers_maiden_name,
      bride_occupation: user.bride?.occupation,
      pastor_id: user.pastor_id,
      location: user.location,
      date_of_seminar: moment(user.date_of_seminar),
      date_schedule_of_marriage: moment(user.date_schedule_of_marriage)
    })
    setConfig([true, 'edit', user])
  }

  const verbsOptions = { message, form, setConfig }

  const WEDDING_SERVICE_FEE_ID = 1
  const matchedServiceFee = serviceFee?.find(row => row.id === WEDDING_SERVICE_FEE_ID)

  const totalSumOfServiceFeeDetail = matchedServiceFee?.details && JSON.parse(matchedServiceFee?.details)
    .map((row, key) => Number(row[`value${key}`])).reduce((acc, cur) => acc + cur, 0)

  const onSubmit = async (wedding) => {

    wedding.date_of_seminar = moment(wedding.date_of_seminar).format('YYYY-MM-DD')
    wedding.date_schedule_of_marriage = moment(wedding.date_schedule_of_marriage).format('YYYY-MM-DD')

    wedding.service_fee_id = WEDDING_SERVICE_FEE_ID
    wedding.service_fee_detail = matchedServiceFee?.details
    wedding.amount = totalSumOfServiceFeeDetail

    if (wedding.service_fee_detail?.length) {


      if (actionType === 'edit') {
        dispatch(updateWedding({ ...wedding, id: selectedWedding.id }, verbsOptions))
      }

      if (actionType === 'add') {

        if (processConfig.form === weddingProcess) {

          setWeddingProcess(prev => prev + 1)

        } else {

          dispatch(addWedding(wedding, verbsOptions))

        }

      }


    } else {
      message.warning('Please add S first')
    }


  }



  return (
    <main className='weddings'>
      <h1 className='title'>Wedding</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />
      <Button className='btn-add-user' type='primary' onClick={openModal}>New Wedding</Button>
      <Table className='wedding-table' attributes={{ dataSource, isLoading: isLoadingWeddings, isSearching, columns: weddingColumns }} />
      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoadingWeddings}
        form={form}
        onSubmit={onSubmit}
        modalWidth={actionType === 'view' ? 1400 : 700}
        selectedWedding={selectedWedding}
        isLoadingUsers={isLoadingUsers}
        validatedUsers={validatedUsers.filter(user => user.id !== auth?.loggedData?.user?.id)}
        users={users.filter(user => user.id !== auth?.loggedData?.user?.id)}
        serviceFee={serviceFee}
        processConfig={processConfig}
        weddingProcess={weddingProcess}
        setWeddingProcess={setWeddingProcess}
      />}
    </main>
  )
}