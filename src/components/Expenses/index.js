import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchExpenses, addExpense, updateExpense, deleteExpense} from '../../states/expenses/actions'
import {fetchUsers} from '../../states/users/actions'

import './index.scss'
import moment from 'moment';
 
import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Space from 'antd/lib/space'

import FormModal from './FormModal'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function Expenses() {
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedExpense] = config

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const {isLoading, data: expenses} = useSelector((state) => state.expenses)
 
  useEffect(() => {dispatch(fetchExpenses())}, [dispatch])
 
  const {data: users} = useSelector((state) => state.users)
 
  useEffect(() => {dispatch(fetchUsers())}, [dispatch])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
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
        render: (_,row) => {
  
        const aog = expenses.find((aog) => aog.id === row.id)

        return (
        <Space size="middle">
          <div onClick={onEdit(aog)}>Edit</div>          
          <Popconfirm
            title={`Are you sure to delete ${aog.name}?`}
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
    function processData(data) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      data.filter((aog) => toTrimStringLower(aog.name)
      .includes(toTrimStringLower(searchKey))) 
      : data
    }
    return processData(expenses)
  }

  function csv(){
    const hasData = dataSource().length
    const header = [['Name', 'Amount', 'Remarks', 'Date Created']]
    const body = hasData ?
    dataSource().map(({name, amount, remarks, created_at}) => 
    Object.values({name, amount, remarks, created_at: moment(created_at).format('LLLL')}))
    : [[ '','No Data Available', '', '']]

    return {
      filename: `expenses-${moment().format('LL').toLocaleLowerCase()}.csv`,
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

   const onEdit = (expense) => () => {
    form.setFieldsValue(expense)
    setConfig([true, 'edit', expense])
  }

  const verbsOptions = { message, form, setConfig}

  const confirmDelete = (expense) => () => dispatch(deleteExpense(expense, verbsOptions))
 
  const onSubmit = async (expense) => { 
     if (actionType === 'add') {
 
      dispatch(addExpense(expense, verbsOptions))
    }
    if (actionType === 'edit') {
 
      dispatch(updateExpense({ ...expense, id: selectedExpense.id}, verbsOptions))
    }
  }

  return (
    <main className='expenses'>
        <h1 className='title'>Expenses</h1>
        <Button className='btn-export-light' type='primary' ghost>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button>
        <Search onSearch={onSearch}/>
        <Button className='btn-add' type='primary' onClick={openModal}>Add Expense</Button>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='expense-table'/>
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
      />}
    </main>
  )
}