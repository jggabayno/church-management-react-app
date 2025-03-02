import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import CSelect from '../shared/Select'
import DatePicker from 'antd/lib/date-picker'
import moment from 'moment'
import Descriptions from 'antd/lib/descriptions'

export default function FormModalActivity(props) {

  const disabledDate = (current) => current <= moment().subtract(1, "days")

  function formatActivityData() {

    if (props.actionType === 'view') {
      const participantIds = props.actionType === 'view' && `[${props?.selectedActivity?.participants}]`?.replaceAll(']', '')?.replaceAll('[', '')?.split(',').map(n => Number(n))

      const participants = props.users.filter(user => participantIds?.includes(user.id))
        .map(user => `${user.first_name} ${user.last_name}`)

      const activity = { ...props.selectedActivity, participants }

      return activity
    }

    return {}
  }

  const activity = formatActivityData()


  return (
    <FormModal {...props} formId='form-activity' modalTitle='Activity'>

      {props.actionType === 'view' &&

        <Descriptions layout='vertical' column={1}>
          <Descriptions.Item label="Agenda">{activity.agenda}</Descriptions.Item>
          <Descriptions.Item label="Remarks">{activity.remarks}</Descriptions.Item>
          <Descriptions.Item label="Date of Activity">{moment(activity.date).format('LL')}</Descriptions.Item>
          <Descriptions.Item label="Participants">{activity.participants.toString().replace(',', ', ')}</Descriptions.Item>
        </Descriptions>

      }

      {
        props.actionType !== 'view' &&
        <>

          <Form.Item
            name="agenda"
            label="Agenda"
            rules={[{ required: true, message: 'Agenda is Required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="Remarks"
            rules={[{ required: true, message: 'Remarks is Required' }]}
          >
            <Input type='textarea' showCount maxLength={100} />
          </Form.Item>

          <Form.Item label="Date of Activity" name="date"
            rules={[{ required: true, message: "Date of Activity is Required" }]}
          >
            <DatePicker size='large' disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            name="participants"
            label="Participants"
            rules={[{ required: true, message: 'Provider is Required' }]}
          >
            <CSelect placeholder="Select Participants" mode="multiple">
              {props.users.map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
            </CSelect>
          </Form.Item>

        </>
      }

    </FormModal >
  )
}