import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'

export default function FormModalExpense(props) {

    return (
      <FormModal {...props} formId='form-expense' modalTitle='Expense'>
 
        <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Name is Required' }]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Amount is Required' }]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="remarks"
        label="Remarks"
        rules={[{ required: true, message: 'Remarks is Required' }]}
        >
        <Input type='textarea' showCount maxLength={100}/>
        </Form.Item>
 
      </FormModal>
    )
}