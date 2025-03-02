import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Profile from './components/Profile'
import Weddings from './components/Services/Weddings'
import Baptisms from './components/Services/Baptisms'
import ServiceFee from './components/Services/Fee'

import EventCalendar from './components/Services/EventCalendar'

import OfferingsAndDonations from './components/OfferingsAndDonations'
import Activities from './components/Activities'

import ActivityLogs from './components/ActivityLogs'
import UserManagement from './components/UserManagement'
import Payments from './components/Services/Payments'
import Expenses from './components/Expenses'

export default function useRoutes({ auth, pathname }) {

    const notFoundRoute = { path: "*", element: <>Not Found</> }

    const publicRoute = [
        { path: '/', element: <Login /> },
        notFoundRoute
    ]

    const isAdmin = Number(auth.loggedData?.user?.user_type_id) === 1

    const adminRouteOnly = isAdmin ?
        [
            { slug: 'User Management', path: '/user-management', element: <UserManagement /> },
            { slug: 'ActivityLogs', path: '/activity-logs', element: <ActivityLogs /> },
        ]
        : []

    const privateRoutes = [
        { slug: 'Dashboard', path: ['/', '/dashboard'].includes(pathname) && pathname, element: <Dashboard /> },
        { slug: 'Members', path: '/members', element: <Users /> },
        { slug: 'Weddings', path: '/services/weddings', element: <Weddings /> },
        { slug: 'Baptismal', path: '/services/baptismal', element: <Baptisms /> },
        { slug: 'Fee Settings', path: '/fee-settings', element: <ServiceFee /> },
        { slug: 'EventCalendar', path: '/event-calendar', element: <EventCalendar /> },
        { slug: 'Profile', path: '/profile', element: <Profile /> },
        { slug: 'Offerings And Donations', path: '/offerings-and-donations', element: <OfferingsAndDonations /> },
        { slug: 'Church Activities', path: '/church-activities', element: <Activities /> },
        { slug: 'Payment Management', path: '/payment-management', element: <Payments /> },
        { slug: 'Expenses', path: '/expenses', element: <Expenses /> },
        ...adminRouteOnly,
        notFoundRoute
    ]

    const routes = auth.isLoggedIn ? privateRoutes : publicRoute

    return routes
}