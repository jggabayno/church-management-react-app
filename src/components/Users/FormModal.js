import moment from 'moment'
import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import Select from 'antd/lib/select'
import Descriptions from 'antd/lib/descriptions'
import Avatar from 'antd/lib/avatar'
import Switch from 'antd/lib/switch'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import ImageUpload from '../shared/ImageUpload'
import CSelect from '../shared/Select'

export default function FormModalUser(props) {

  const disabledDate = (current) => current >= moment().subtract(5, "years")

  return (
    <FormModal {...props} formId='form-user' modalTitle='Member'>

      {props.actionType === 'view' &&
        <>
          <Descriptions title='Basic Detail' column={2} className='detail-descriptions'>
            <Descriptions.Item label="Photo" className='desc-label-photo'><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + props.selectedUser.photo} alt='user' /></Descriptions.Item>
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
            <Descriptions.Item label="Citizenship" >{props.selectedUser.citizenship === 1 ? 'Filipino' : 'Other'}</Descriptions.Item>
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
          <ImageUpload
            FormItem={Form.Item}
            imageUrl={props.imageUrl}
            uploadImage={props.uploadImage}
            actionType={props.actionType}
            ENV_IMG_URL={process.env.REACT_APP_API_USER_PHOTO}
            className='user-image-upload'
          />

          <Form.Item
            name="position_id"
            label="Position"
            rules={[{ required: true, message: 'Position is Required' }]}
          >
            <CSelect placeholder="Select position" loading={props.isLoadingUserPositions}>
              <Select.Option value={0} key={0}>N/A</Select.Option>
              {props.userPositions.map(position => (
                <Select.Option value={position.id} key={position.id}>{position.name}</Select.Option>
              ))}
            </CSelect>
          </Form.Item>

          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: 'First Name is Required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="middle_name"
            label="Middle Name"
            rules={[{ required: true, message: 'Middle Name is Required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: 'Last Name is Required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Gender is Required' }]}
          >
            <CSelect placeholder="Select gender">
              <Select.Option value={1}>Male</Select.Option>
              <Select.Option value={2}>Female</Select.Option>
            </CSelect>
          </Form.Item>

          <Form.Item
            name="citizenship"
            label="Citizenship"
            rules={[{ required: true, message: 'Citizenship is Required' }]}
          >
            <CSelect placeholder="Select citizenship">
              <Select.Option value={1}>Filipino</Select.Option>
              <Select.Option value={2}>Other</Select.Option>
            </CSelect>
          </Form.Item>

          <Form.Item label="Birth Date" name="birth_date"
            rules={[{ required: true, message: "Birth Date is Required" }]}
          >
            <DatePicker
              disabledDate={disabledDate}
              size='large' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="place_of_birth"
            label="Birth Place"
            rules={[{ required: true, message: "Birth Place is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="house_no"
            label="House No."
            rules={[{ required: true, message: "House No. is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="street"
            label="Street"
            rules={[{ required: true, message: "Street is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="barangay"
            label="Barangay"
            rules={[{ required: true, message: "Barangay is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="municipality"
            label="Municipality"
            rules={[{ required: true, message: "Municipality is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobile_number"
            label="Mobile Number"
            rules={[{ required: true, message: "Mobile Number Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Status" name='status' valuePropName="checked"
            rules={[{ required: true, message: "Status Required" }]}
          >
            <Switch />
          </Form.Item>

        </>
      }

    </FormModal>
  )
}