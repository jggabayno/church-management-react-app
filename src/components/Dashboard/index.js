import { useState } from 'react'
import { fetchDashboard } from '../../states/dashboard/actions'
import Button from '../shared/Button'
import RangePicker from '../shared/RangePicker'
import './index.scss'
import moment from 'moment';
import { CgSoftwareDownload } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Age from './components/Age'
import MemberByPositionGraph from './components/MemberByPositionGraph'
import { CSVLink } from "react-csv";

export default function Dashboard() {

    const [rangeDate, setRangeDate] = useState()
    const [dateFrom, dateTo] = rangeDate || ['', '']
    const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))

    const { isLoading, data: dashboard } = useSelector((state) => state.dashboard)
    const dispatch = useDispatch()

    useEffect(() => { dispatch(fetchDashboard({ dateFrom, dateTo })) }, [dispatch, dateFrom, dateTo]);

    const { members, offerings, donations, weddings, baptisms, age_brackets, payment_amount, member_positions, expenses } = dashboard

    const age = age_brackets?.map(({ bracket, total }) => ({
        name: bracket === 1 ? '19 Years old and Below' : bracket === 2 ? '20-29 Years old' : '30 Years old and Above',
        value: Number(Number((total / age_brackets.map(row => row.total).reduce((acc, cur) => acc + cur)) * 100).toFixed(0)) || 0,
        color: bracket === 1 ? '#1083d6' : bracket === 2 ? '#119BFF' : '#5db7f6',
    }))

    const hasData = dashboard.hasOwnProperty('members')

    function csv() {

        const header = ['Dashboard', '', '', '', '', '', '']
        const memberPositionsValues = [...(member_positions || [])?.map(row => row.count), '', '', '']
        const memberAgeBracketsValues = [...(age_brackets || [])?.map(row => row.total), '', '', '', '']

        const body = hasData ? [
            [`Start Date:${dateFrom ? dateFrom : 'ALL'}`, '', '', '', '', '', ''],
            [`End Date: ${dateTo ? dateTo : 'ALL'}`, '', '', '', '', '', ''],
            [``, '', '', '', '', '', ''],
            ['Total Members', 'Offerings', 'Donations', 'Service Payments', 'Expenses', 'Total Wedding', 'Total Baptism'],
            [members, offerings?.toLocaleString(), donations?.toLocaleString(), payment_amount?.toLocaleString(), expenses?.toLocaleString(), weddings, baptisms],
            [``, '', '', '', '', '', ''],
            ['Members Positions', '', '', '', '', '', ''],
            ['Members', 'Worker', 'Leader', 'Pastor', '', '', ''],
            memberPositionsValues,
            [``, '', '', '', '', '', ''],
            ['Members Age Bracket', '', '', '', '', '', ''],
            ['19 Years old and Below', '20-29 Years old', '30 Years old and Above', '', '', '', ''],
            memberAgeBracketsValues,
        ] : [['', '', '', 'No Data Available', '', '', '']]

        return {
            filename: `dashboard-${moment().format('LL')}.csv`,
            data: [header, ...body]
        }
    }

    return (
        <main className="dashboard">
            <h1 className='title'>Dashboard</h1>
            <Button className='btn-export' loading={isLoading}>
                <CSVLink {...csv()}><CgSoftwareDownload />Export</CSVLink>
            </Button>
            <div className='display-date'>Date as of: {dateFrom || 'ALL'} - {dateTo || 'ALL'}</div>
            <RangePicker
                onChange={onChangeDate}
                disabled={isLoading}
                value={rangeDate?.map(date => moment(date))}
                className='range-date'
                format='MM/DD/YYYY'
                allowEmpty={true}
            />
            <section className='total'>
                <div className='total-item'>
                    <h3>{members?.toLocaleString()}</h3>
                    <span>Total Members</span>
                </div>

                <div className='total-item'>
                    <h3>{weddings?.toLocaleString()}</h3>
                    <span>Total Wedding</span>
                </div>

                <div className='total-item'>
                    <h3>{baptisms?.toLocaleString()}</h3>
                    <span>Total Baptismal</span>
                </div>

                {/* <div className='total-item'>
                    <h3>&#8369; {offerings?.toLocaleString()}</h3>
                    <span>Offerings</span>
                </div>
                <div className='total-item'>
                    <h3>&#8369; {donations?.toLocaleString()}</h3>
                    <span>Donations</span>
                </div> */}
                <div className='total-item'>
                    <h3>&#8369; {payment_amount?.toLocaleString()}</h3>
                    <span>Service Payments</span>
                </div>

                <div className='total-item'>
                    <h3>&#8369; {expenses?.toLocaleString()}</h3>
                    <span>Expenses</span>
                </div>


            </section>
            <Age data={age} />
            <MemberByPositionGraph data={member_positions} />
        </main>
    )
}