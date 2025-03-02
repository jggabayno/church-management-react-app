import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivities, addActivity, updateActivity, deleteActivity } from '../../states/activities/actions'
import { fetchUsers } from '../../states/users/actions'

import './index.scss'
import moment from 'moment';

import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Space from 'antd/lib/space'
import Tooltip from 'antd/lib/tooltip'
import FormModal from './FormModal'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function ActivitiesComp() {
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedActivity] = config

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const { isLoading, data: activities } = useSelector((state) => state.activities)

  useEffect(() => { dispatch(fetchActivities()) }, [dispatch])

  const { data: users } = useSelector((state) => state.users)

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const columns = [
    {
      title: 'Agenda',
      dataIndex: 'agenda',
      sorter: (a, b) => a.agenda.localeCompare(b.agenda)
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      sorter: (a, b) => a.participants.localeCompare(b.participants),
      render: (participant, activityRecord) => {

        const participantIds = `[${participant}]`.replaceAll(']', '')?.replaceAll('[', '')?.split(',').map(n => Number(n))

        const participants = users.filter(user => participantIds.includes(user.id))
          .map(user => `${user.first_name} ${user.last_name}`)

        const activity = { ...activityRecord, participants }

        const text = activity.participants.toString().replace(',', ', ')

        const BASE_TEXT_LENGTH = 20

        const finalText = text.length > BASE_TEXT_LENGTH ? `${text.slice(0, BASE_TEXT_LENGTH)}...` : text

        return <Tooltip title={text}>{finalText}</Tooltip>

      }
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      sorter: (a, b) => a.remarks.localeCompare(b.remarks)
    },
    {
      title: 'Date of Activity',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: (date) => moment(date).format('LL')
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

        const activity = activities.find((activity) => activity.id === row.id)

        return (
          <Space size="middle">
            <div onClick={onView(activity)}>View</div>
            <div onClick={onEdit(activity)}>Edit</div>
            <Popconfirm
              title={`Are you sure to delete ${activity.agenda}?`}
              onConfirm={confirmDelete(activity)}
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
    function processData(activities) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        activities.filter((activity) => toTrimStringLower(activity.agenda)
          .includes(toTrimStringLower(searchKey)))
        : activities
    }

    return processData(activities)

  }

  function csv() {

    const hasData = dataSource().length

    const header = [['Agenda', 'Remarks', 'Participants', 'Date', 'Date Created']]

    const body = hasData ?
      dataSource().map(({ agenda, remarks, participants, date, created_at, ...rest }) => {

        const participantIds = `[${participants}]`.replaceAll(']', '')?.replaceAll('[', '')?.split(',').map(n => Number(n))

        const participantsArray = users.filter(user => participantIds?.includes(user.id))
          .map(user => `${user.first_name} ${user.last_name}`)

        const detail = { agenda, remarks, participants, date, created_at, ...rest }

        const activity = { ...detail, participants: participantsArray }

        const text = activity.participants.toString().replace(',', ', ')

        return Object.values({ agenda, remarks, participants: text, date: moment(date).format('LLLL'), created_at: moment(created_at).format('LLLL') })
      })
      : [['', 'No Data Available', '']]

    return {
      filename: `activities-${moment().format('LL').toLocaleLowerCase()}.csv`,
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


  const onEdit = (activity) => () => {
    activity.date = moment(activity.date)
    activity.participants = `[${activity?.participants}]`.replaceAll(']', '')?.replaceAll('[', '')?.split(',').map(n => Number(n))

    form.setFieldsValue(activity)
    setConfig([true, 'edit', activity])
  }

  const onView = (activity) => () => {

    setConfig([true, 'view', activity])

    form.setFieldsValue({
      ...activity,
      date: moment(activity.date)
    })

  }

  const verbsOptions = { message, form, setConfig }

  const confirmDelete = (activity) => () => dispatch(deleteActivity(activity, verbsOptions))

  const onSubmit = async (activity) => {

    activity.date = moment(activity.date).format('YYYY-MM-DD')
    activity.participants = JSON.stringify(activity.participants)

    if (actionType === 'add') {

      dispatch(addActivity(activity, verbsOptions))
    }

    if (actionType === 'edit') {

      dispatch(updateActivity({ ...activity, id: selectedActivity.id }, verbsOptions))
    }

  }

  return (
    <main className='activities'>
      <h1 className='title'>Church Activities</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />

      <Button className='btn-add' type='primary' onClick={openModal}>New Activity</Button>
      <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns }} className='activity-table' />

      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        modalWidth={500}
        users={users}
        selectedActivity={selectedActivity}
      />}
    </main>
  )
}