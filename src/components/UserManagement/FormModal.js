import moment from 'moment'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Descriptions from 'antd/lib/descriptions'
import Avatar from 'antd/lib/avatar'
import Switch from 'antd/lib/switch'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import CSelect from '../shared/Select'

export default function FormModalUser(props) {
  
  function onSelectUser(userId){
    const email = props.users.find(user => user.id === userId)?.email
    props.form.setFieldsValue({email})
  }  

  return (
      <FormModal {...props} formId='form-user' modalTitle='User Account'>

      {props.actionType === 'view' &&
      <>
      <Descriptions title='Basic Detail' column={2} className='detail-descriptions'>
      <Descriptions.Item label="Photo" className='desc-label-photo'><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + props.selectedUser.photo} alt='user'/></Descriptions.Item>
      <Descriptions.Item>
      <Descriptions column={1} className='detail-descriptions'>
        <Descriptions.Item label="Position" >
        {props.userPositions?.find(position => position.id === props.selectedUser?.position_id)?.name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Mobile Number" >{props.selectedUser.mobile_number}</Descriptions.Item>
        <Descriptions.Item label="Email" >{props.selectedUser.email}</Descriptions.Item>
      </Descriptions>
      </Descriptions.Item>

      <Descriptions.Item label="Name" >{props.selectedUser.name}</Descriptions.Item>
     
      
      <Descriptions.Item label="Age" >{props.selectedUser.age}</Descriptions.Item>
      <Descriptions.Item label="Gender" >{props.selectedUser.gender === '1' ? 'Male' : 'Female'}</Descriptions.Item>
      <Descriptions.Item label="Citizenship" >{props.selectedUser.citizenship === 1 ? 'Filipino' : 'Other' }</Descriptions.Item>
      <Descriptions.Item label="Birth Date" >{moment(props.selectedUser.birth_date).format('LL')}</Descriptions.Item>
      <Descriptions.Item label="Place of Birth" >{props.selectedUser.place_of_birth}</Descriptions.Item>
      </Descriptions>
      <Descriptions title='Address' column={2} className='detail-descriptions'>
      <Descriptions.Item label="House No." >{props.selectedUser.address[0]?.house_no || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Street" >{props.selectedUser.address[0]?.street || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Barangay" >{props.selectedUser.address[0]?.barangay || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Municipality" >{props.selectedUser.address[0]?.municipality || 'N/A'}</Descriptions.Item>

      </Descriptions>
      </>}

      {props.actionType !== 'view' &&  
      <>

<Form.Item
      name="id"
      label="User"
      rules={[{ required: true, message: 'User is Required' }]}
      >
      <CSelect placeholder="Select User" onChange={onSelectUser}>
        {props.users.map(user => (<Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>))}   
       </CSelect>
      </Form.Item>
 
    <Form.Item
      name="user_type_id"
      label="User Type"
      rules={[{ required: true, message: 'User Type is Required' }]}
      >
      <CSelect placeholder="Select User Type">
        <Select.Option value={1} key={1}>Admin</Select.Option>
        <Select.Option value={2} key={2}>Staff</Select.Option>
      </CSelect>
      </Form.Item>

      <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, message: "Email Required" }]}
      >
      <Input/>
      </Form.Item>

      <Form.Item
          label='Password'
          name="password"
          rules={[{ required: true, message: "Password Required" }]}
          >
          <Input placeholder="Password" type="password" />
       </Form.Item>
       
      </>
      }

      </FormModal>
    )
}