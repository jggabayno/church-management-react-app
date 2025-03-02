import { useNavigate } from 'react-router-dom'
import Menu from 'antd/lib/menu'
import {
    BlockOutlined, DashboardOutlined, ShoppingOutlined, StockOutlined,
    BarsOutlined, SettingOutlined, CalendarOutlined, MoneyCollectOutlined,
    UserOutlined, HeartOutlined, GiftOutlined, InboxOutlined, InteractionOutlined
}
    from '@ant-design/icons';
import { useSelector } from 'react-redux';


export default function CMenu() {

    const navigate = useNavigate()
    const selectKey = (e) => navigate(e.key)

    const auth = useSelector(state => state.auth)

    const isAdmin = Number(auth.loggedData?.user?.user_type_id) === 1

    return (
        <Menu mode='inline' defaultSelectedKeys={['/']} onSelect={selectKey}>
            <Menu.Item key="/" icon={<DashboardOutlined />}>
                Dashboard
            </Menu.Item>
            <Menu.Item key="/members" icon={<UserOutlined />}>
                Members
            </Menu.Item>
            <Menu.SubMenu key="products-scope" icon={<ShoppingOutlined />} title="Services">
                <Menu.Item key="/services/weddings" icon={<HeartOutlined />}>Weddings</Menu.Item>
                <Menu.Item key="/services/baptismal" icon={<GiftOutlined />}>Baptismal</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="/event-calendar" icon={<CalendarOutlined />}>Event Calendar</Menu.Item>
            <Menu.Item key="/fee-settings" icon={<BlockOutlined />}>Fee Settings</Menu.Item>
            <Menu.Item key="/payment-management" icon={<MoneyCollectOutlined />}>Payment Management</Menu.Item>
            <Menu.Item key="/church-activities" icon={<InteractionOutlined />}>Church Activities</Menu.Item>

            <Menu.Item key="/offerings-and-donations" icon={<InboxOutlined />}>
                Offerings & Donations
            </Menu.Item>
            <Menu.Item key="/expenses" icon={<StockOutlined />}>
                Expenses
            </Menu.Item>
            {isAdmin &&
                <>
                    <Menu.Item key="/activity-logs" icon={<BarsOutlined />}>
                        Activity Log
                    </Menu.Item>
                    <Menu.Item key="/user-management" icon={<SettingOutlined />}>
                        User Management
                    </Menu.Item>
                </>
            }
        </Menu>
    )
}
