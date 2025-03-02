import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayments } from '../../../states/payments/actions'
import './index.scss'
import Button from '../../shared/Button'
import Table from '../../shared/Table'
import Search from '../../shared/Search'
import moment from 'moment'
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function Fee() {

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const dispatch = useDispatch()

  const { isLoading, data: payments } = useSelector((state) => state.payments)

  useEffect(() => { dispatch(fetchPayments()) }, [dispatch])

  const columns = [
    {
      title: 'Service No',
      dataIndex: 'user_taken_service_no',
      sorter: (a, b) => a.user_taken_service_no.localeCompare(b.user_taken_service_no)
    },
    {
      title: 'Service Type',
      dataIndex: 'service_fee_name',
    },
    {
      title: 'Details',
      dataIndex: 'service_fee_detail',
      render: (_, row) => {

        const details = JSON.parse(row.service_fee_detail)

        const total = details?.map((row, key) => Number(row[`value${key}`])).reduce((a, c) => a + c, 0).toLocaleString()

        if (!row.service_fee_detail) return <>N/A</>
        return (
          <div>
            <div>
              {details.map((r, k) => {
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
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => a.amount.localeCompare(b.amount),
      render: (amount) => <span>&#8369; {amount}</span>
    },
  ]

  function dataSource() {
    const details = payments.map(payment => ({ ...payment, service_fee_name: payment.service_fee_id === 1 ? 'Wedding' : 'Baptism' }))
    function processData(data) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ?
        data.filter((payment) => toTrimStringLower(payment.user_taken_service_no)
          .includes(toTrimStringLower(searchKey)))
        : data
    }
    return processData(details)
  }


  function csv() {
    const hasData = dataSource().length
    const header = [['Service No', 'Service Type', 'Amount', 'Date Created']]
    const body = hasData ?
      dataSource().map(({ user_taken_service_no, service_fee_name, amount, created_at }) =>
        Object.values({ user_taken_service_no, service_fee_name, amount, created_at: moment(created_at).format('LLLL') }))
      : [['', 'No Data Available', '', '']]

    return {
      filename: `payments-${moment().format('LL').toLocaleLowerCase()}.csv`,
      data: [header, ...body]
    }
  }


  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }

  return (
    <main className='payments'>
      <h1 className='title'>Payment Management</h1>
      <Button className='btn-export-light' type='primary' ghost>
        <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
      </Button>
      <Search onSearch={onSearch} />
      <Table className='payments-table' attributes={{ dataSource, isLoading, isSearching, columns }} />
    </main>
  )
}