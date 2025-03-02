import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import CSelect from '../shared/Select'

export default function FormModalOfferingsAndDonations(props) {

  return (
    <FormModal {...props} formId='form-aog' modalTitle={props.isOfferingsActiveTab ? 'Offering' : 'Invidual Donation'}>

      {!props.isOfferingsActiveTab && <Form.Item
        name="provider_id"
        label="Provider"
        rules={[{ required: true, message: 'Provider is Required' }]}
      >
        <CSelect placeholder="Select Provider">
          {props.users.map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
        </CSelect>
      </Form.Item>}

      <Form.Item
        name="amount"
        label="Amount"
        tooltip="Type 0 if the offering is In-Kind"
        rules={[{ required: true, message: 'Amount is Required' }]}
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

    </FormModal>
  )
}