import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchServiceFee, addServiceFee, updateServiceFee } from '../../../states/servicefee/actions'
import './index.scss'
import moment from 'moment';
import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import FormModal from './FormModal'
import Button from '../../shared/Button'
import Table from '../../shared/Table'
import Search from '../../shared/Search'
import Space from 'antd/lib/space'

export default function Fee() {

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedFee] = config
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const { isLoading, data: servicefee } = useSelector((state) => state.servicefee)

  useEffect(() => { dispatch(fetchServiceFee()) }, [dispatch])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Details',
      dataIndex: 'details',
      render: (_, row) => {

        const total = row.details?.map((row, key) => Number(row[`value${key}`])).reduce((a, c) => a + c, 0).toLocaleString()

        if (!row.details) return <>N/A</>
        return (
          <div>
            <div>
              {row.details.map((r, k) => {
                const key = r[`key${k}`]
                const value = Number(r[`value${k}`]).toLocaleString()
                return (
                  <div key={k}><span>{key}:</span> <span>&#8369; {value}</span></div>
                )
              })}
            </div>
            <div className='total'><span>Total: </span><span> &#8369;{total}</span></div>
          </div>
        )
      }
    },
    {
      title: 'Actions',
      render: (_, row) => {

        const sf = servicefee.find((sf) => sf.id === row.id)
        return (
          <Space size="middle" className='servicefee-actions'>
            <div onClick={onEdit(sf)}>Edit</div>
          </Space>
        )
      }
    }
  ]

  function dataSource() {
    const details = servicefee.map(row => ({ ...row, details: JSON.parse(row?.details) }))
    function processData(servicefee) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        servicefee.filter((sf) => toTrimStringLower(sf.name)
          .includes(toTrimStringLower(searchKey)))
        : servicefee
    }
    return processData(details)
  }

  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }

  const closeModal = () => {
    setConfig([false, null, null])
    form.resetFields()
  }

  const onEdit = (servicefee) => () => {
    form.setFieldsValue({
      ...servicefee,
      details: JSON.parse(servicefee.details)
    })
    setConfig([true, 'edit', servicefee])
  }

  const verbsOptions = { message, form, setConfig }

  const onSubmit = async (servicefee) => {
    if (actionType === 'add') dispatch(addServiceFee(servicefee, verbsOptions))
    if (actionType === 'edit') dispatch(updateServiceFee({ ...servicefee, id: selectedFee.id }, verbsOptions))
  }

  return (
    <main className='servicefee'>
      <h1 className='title'>Fee Settings</h1>
      <Table className='fee-table' attributes={{ dataSource, isLoading, isSearching, columns }} />
      {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        modalWidth={actionType === 'view' ? 700 : 500}
        selectedFee={selectedFee}
      />}
    </main>
  )
}