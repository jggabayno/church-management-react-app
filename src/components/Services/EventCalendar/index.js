import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeddings } from '../../../states/weddings/actions'
import { fetchBaptisms } from '../../../states/baptisms/actions'
import { fetchActivities } from '../../../states/activities/actions'

import Calendar from 'antd/lib/calendar'
import moment from 'moment';
import { Link } from 'react-router-dom'
import './index.scss'

export default function EventCalendar() {

  const dispatch = useDispatch()
  const { data: weddings } = useSelector((state) => state.weddings)
  useEffect(() => { dispatch(fetchWeddings()) }, [dispatch])

  const { data: baptisms } = useSelector((state) => state.baptisms)
  useEffect(() => { dispatch(fetchBaptisms()) }, [dispatch])

  const { data: activities } = useSelector((state) => state.activities)
  useEffect(() => { dispatch(fetchActivities()) }, [dispatch])

  const weddingData = weddings.flatMap(wedding => {
    return [{
      id: wedding?.id,
      title: `${wedding?.groom?.first_name} & ${wedding?.bride?.first_name} ${wedding?.bride?.last_name} Wedding`,
      pastor: `${wedding?.pastor?.first_name} ${wedding?.pastor?.last_name}`,
      date: wedding.date_schedule_of_marriage,
      mark_as: 'Date Schedule of Marriage',
      tag_as: 'wedding'
    },
    {
      id: wedding?.id,
      title: `${wedding?.groom?.first_name} & ${wedding?.bride?.first_name} ${wedding?.bride?.last_name} Wedding`,
      pastor: `${wedding?.pastor?.first_name} ${wedding?.pastor?.last_name}`,
      date: wedding.date_of_seminar,
      mark_as: 'Date of Wedding Seminar',
      tag_as: 'wedding'
    }
    ]
  })

  const baptismData = baptisms.flatMap(baptism => {
    return [{
      id: baptism?.id,
      title: `${baptism?.person?.first_name} ${baptism?.person?.last_name} Baptism`,
      pastor: `${baptism?.pastor?.first_name} ${baptism?.pastor?.last_name}`,
      date: baptism.date_of_baptism,
      mark_as: 'Date of Baptism',
      tag_as: 'baptism'
    }]
  })

  const activityData = activities.flatMap(activity => {
    return [{
      id: activity?.id,
      title: `${activity.agenda}`,
      pastor: `${activity.remars}`,
      date: activity.date,
      mark_as: 'Date of Activity',
      tag_as: 'activity'
    }]
  })

  const combinedServices = [...weddingData, ...baptismData, ...activityData]

  // CALENDAR DEFAULT CONFIGURATIONS

  function getDateData(value, data) {

    const matched = (row, value) => moment(row.date).format('MM/DD/YYYY').includes(moment(value).format('MM/DD/YYYY'))

    const hasOrderDeliveryDate = data.some(row => matched(row, value))
    const filteredOrder = data.filter(row => matched(row, value))

    if (hasOrderDeliveryDate) return filteredOrder

  }

  function dateCellRender(value) {

    const data = getDateData(value, combinedServices);

    return (
      <ul className="events">
        {data?.map(service => (
          <li key={service.id} className={`${service.tag_as === 'baptism' ? 'baptism-theme' : service.tag_as === 'wedding' ? 'wedding-theme' : 'activity-theme'}`}>
            {/* <Link to={`/services/${service.tag_as === 'baptism' ? 'baptisms'  : 'weddings'}/${service.id}`}> */}
            <div>{service.title}</div>
            <span className='date-subtitle'>{service.mark_as}</span>
            {/* </Link> */}
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value, data) {

    const matched = (row, value) => moment(row.date).format('MM').includes(moment(value).format('MM'))

    const hasOrderDeliveryDate = data.some(row => matched(row, value))
    const filteredOrder = data.filter(row => matched(row, value))

    if (hasOrderDeliveryDate) {
      return filteredOrder
    }

  }

  function monthCellRender(value) {

    const data = getMonthData(value, combinedServices);

    return data ? (
      <div className="notes-month">
        <section>
          {data?.map(service => {
            return (
              <li key={service.id}>
                <Link to={`/orders/${service.id}`}>
                  <div>{service.title}</div>
                  <span className='date-subtitle'>{service.mark_as}</span>
                </Link>
              </li>
            )
          })}
        </section>
      </div>
    ) : null;
  }

  // END CALENDAR ...

  return (
    <main className='event-calendar'>
      <h1 className='title'>Event Calendar</h1>
      <Calendar className='calendar' dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
    </main>
  )
}