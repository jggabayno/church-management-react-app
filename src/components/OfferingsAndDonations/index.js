import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchActOfGivings, addActOfGiving, updateActOfGiving, deleteActOfGiving } from '../../states/actOfGivings/actions'
import { fetchUsers } from '../../states/users/actions'

import './index.scss'
import moment from 'moment';

import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Tabs from 'antd/lib/tabs'
import Space from 'antd/lib/space'

import FormModal from './FormModal'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function ActOfGivings() {
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedActOfGiving] = config

  const aog = ['Offerings', 'Individual Donation']

  const [activeAog, setActiveAog] = useState('Offerings')

  const isOfferingsActiveTab = activeAog === 'Offerings'

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const { isLoading, data: actOfGivings } = useSelector((state) => state.actOfGivings)

  useEffect(() => { dispatch(fetchActOfGivings()) }, [dispatch])

  const { data: users } = useSelector((state) => state.users)

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const columnProvider = isOfferingsActiveTab ? [] : [{
    title: 'Provider',
    dataIndex: 'provider',
    sorter: (a, b) => a.provider.localeCompare(b.provider)
  }]

  const columns = [

    {
      title: 'AOG No.',
      dataIndex: 'aog_no',
      sorter: (a, b) => a.aog_no.localeCompare(b.aog_no)
    },
    ...columnProvider,
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => a.amount.localeCompare(b.amount),
      render: (amount) => <>&#8369; {Number(amount).toLocaleString()}</>
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      sorter: (a, b) => a.remarks.localeCompare(b.remarks)
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

        const aog = actOfGivings.find((aog) => aog.id === row.id)

        return (
          <Space size="middle">
            <div onClick={onEdit(aog)}>Edit</div>
            <Popconfirm
              title={`Are you sure to delete ${aog.aog_no}?`}
              onConfirm={confirmDelete(aog)}
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
    function processData(actOfGivings) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        actOfGivings.filter((aog) => toTrimStringLower(aog.aog_no)
          .includes(toTrimStringLower(searchKey)))
        : actOfGivings
    }

    const filteredUser = (provider_id) => users?.find(user => user.id === provider_id)

    return processData(isOfferingsActiveTab ? actOfGivings.filter(aog => aog.type === 1) :
      actOfGivings.filter(aog => aog.type === 2).map(row => {
        return ({ ...row, provider: `${filteredUser(row.provider_id)?.first_name} ${filteredUser(row.provider_id)?.last_name}` })
      })
    )
  }

  function csv() {
    const hasData = dataSource().length

    const displayProviderHeader = () => !isOfferingsActiveTab ? ['Provider'] : []
    const displayProviderBody = (provider) => !isOfferingsActiveTab ? { provider } : {}

    const header = [['AOG No', 'Amount', 'Remarks', ...displayProviderHeader(), 'Date Created']]

    const body = hasData ?
      dataSource().map(({ aog_no, amount, provider, remarks, created_at }) =>
        Object.values({ aog_no, amount, remarks, ...displayProviderBody(provider), created_at: moment(created_at).format('LLLL') }))
      : [['', 'No Data Available', '']]

    return {
      filename: `${activeAog}-${moment().format('LL').toLocaleLowerCase()}.csv`,
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

  const onEdit = (aog) => () => {
    form.setFieldsValue(aog)
    setConfig([true, 'edit', aog])
  }

  const verbsOptions = { message, form, setConfig }

  const confirmDelete = (aog) => () => dispatch(deleteActOfGiving(aog, verbsOptions))

  const onSubmit = async (aog) => {
    aog.type = isOfferingsActiveTab ? 1 : 2
    if (actionType === 'add') {

      dispatch(addActOfGiving(aog, verbsOptions))
    }
    if (actionType === 'edit') {

      dispatch(updateActOfGiving({ ...aog, id: selectedActOfGiving.id }, verbsOptions))
    }
  }

  return (
    <main className='act-of-givings'>
      <h1 className='title'>Offerings & Donations</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />

      <Tabs
        onChange={(e) => setActiveAog(e)}
        activeKey={activeAog.toString()}
        className='aog-tabs'
        tabBarExtraContent={<Button className='btn-add' type='primary' onClick={openModal}>{`Add ${isOfferingsActiveTab ? 'Offering' : 'Individual Donation'}`}</Button>}
      >
        {aog?.map(service => {
          return (
            <Tabs.TabPane tab={service} key={service}>
              <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns }} className='aog-table' />
            </Tabs.TabPane>
          )
        })}
      </Tabs>
      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        modalWidth={500}
        isOfferingsActiveTab={isOfferingsActiveTab}
        users={users}
        initialValues={{ amount: 0 }}
      />}
    </main>
  )
}