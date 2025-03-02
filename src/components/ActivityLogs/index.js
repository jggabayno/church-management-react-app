import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchActivityLogs} from '../../states/activityLogs/actions'
import './index.scss'
import moment from 'moment';
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function ActOfGivings() {
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
 
  const dispatch = useDispatch()
 
  const {isLoading, data: activityLogs} = useSelector((state) => state.activityLogs)
 
  useEffect(() => {dispatch(fetchActivityLogs())}, [dispatch])

  const columns = [
       {
        title: 'Module',
        dataIndex: 'module',
        sorter: (a, b) => a.module.localeCompare(b.module),
       },
      {
        title: 'Description',
        dataIndex: 'description',
        sorter: (a, b) => a.description.localeCompare(b.description)
      },
      {
        title: 'Author',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
       },
      {
        title: 'Date Created',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL hh:mm A')
      },        
     
  ]
  
  function dataSource() {
    function  processData(activityLogs) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      activityLogs.filter((activityLog) => toTrimStringLower(activityLog.module)
      .includes(toTrimStringLower(searchKey))) 
      : activityLogs
    }
    return processData(activityLogs.map(activityLog => ({...activityLog,name: `${activityLog?.author?.first_name} ${activityLog?.author?.last_name}`})))
  }

  function csv(){
    const hasData = dataSource().length
    const header = [['Module', 'Description', 'Author', 'Date Created']]
    const body = hasData ?
    dataSource().map(({module, description, name, created_at}) => 
    Object.values({module, description, name, created_at: moment(created_at).format('LLLL')}))
    : [[ '','No Data Available', '','' ]]

    return {
      filename: `activity-logs-${moment().format('LL').toLocaleLowerCase()}.csv`,
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
    <main className='activity-logs'>
        <h1 className='title'>Activity Log</h1>
         <Button className='btn-export-light' type='primary' ghost>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button>
        <Search onSearch={onSearch}/>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='activity-logs-table'/>

    </main>
  )
}