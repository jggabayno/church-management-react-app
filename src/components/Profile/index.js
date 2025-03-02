import { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {fetchProfile} from '../../states/profile/actions'
import {fetchUserPositions} from '../../states/userPositions/actions'
import moment from 'moment'
import Avatar from 'antd/lib/avatar'
import './index.scss'
import Descriptions from 'antd/lib/descriptions'

export default function Profile(){
    
    const dispatch = useDispatch()
    const {isLoading, data: profileData} = useSelector(state => state.profile)
    const {isLoading: isLoadingUserPositions, data: userPositions} = useSelector(state => state.userpositions)

    const profile = profileData

    useEffect(() => {
        dispatch(fetchProfile())
    }, [])

    useEffect(() => {
        dispatch(fetchUserPositions())
    }, [])
 
    return (
        <main className='profile'>
                 <div className='container'>
                    <h1 className='title'>My Profile</h1>
                    {isLoading  ? 'loading...' : 
                    <>
                    <Descriptions column={2} className='detail-descriptions'>
                    <Descriptions.Item label="Photo" className='desc-label-photo' span={2}><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + profile?.photo} alt='user'/></Descriptions.Item>
                    <Descriptions.Item label="Name" className='table-column-text-highlight'>{`${profile?.first_name} ${profile?.middle_name} ${profile?.last_name}`}</Descriptions.Item>
                    <Descriptions.Item label="Mobile Number" >{profile?.mobile_number}</Descriptions.Item>
                    <Descriptions.Item label="Email" >{profile?.email}</Descriptions.Item>

                    <Descriptions.Item label="Position" >{userPositions?.find(position => position.id === profile?.position_id)?.name}</Descriptions.Item>
                    <Descriptions.Item label="Age" >{profile?.age}</Descriptions.Item>
                    <Descriptions.Item label="Gender" >{profile?.gender === '1' ? 'Male' : 'Female'}</Descriptions.Item>
                    <Descriptions.Item label="Citizenship" >{profile?.citizenship === 1 ? 'Filipino' : 'Other'}</Descriptions.Item>
                    <Descriptions.Item label="Birth Date" >{moment(profile?.birth_date).format('LL')}</Descriptions.Item>
                    <Descriptions.Item label="Place of Birth" >{profile?.place_of_birth}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title='Address' column={2} className='detail-descriptions'>
                    <Descriptions.Item label="House No.">{profile?.address?.length ? profile?.address[0]?.house_no : 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Street">{profile?.address?.length ? profile?.address[0]?.street : 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Barangay" >{profile?.address?.length ? profile?.address[0]?.barangay : 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Municipality" >{profile?.address?.length ? profile?.address[0]?.municipality : 'N/A'}</Descriptions.Item>

                    </Descriptions>
                    </>
                    }
                </div>
         </main>
    )
}