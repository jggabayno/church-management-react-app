import Form from 'antd/lib/form'
import moment from 'moment'
import Input from '../../shared/Input'
import FormModal from '../../shared/FormModal'
import Button from '../../shared/Button'

import Space from 'antd/lib/space'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


 
export default function FormModalUser(props) {

  const disabledDate = (current) => current <= moment().subtract(1, "days")

  return (
      <FormModal formId="form-fee" modalTitle='Fee' {...props}>
        
        <Form.Item label="Name"  name="name"
        rules={[{ required: true, message: "Name is Required" }]}
        >
        <Input disabled/>
        </Form.Item>
        <Form.Item label="Details"
        >
        <Form.List name="details">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, `key${name}`]}
                  rules={[{ required: true, message: 'Missing key' }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, `value${name}`]}
                  rules={[{ required: true, message: 'Missing value' }]}
                >
                  <Input placeholder="Amount" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>
      </FormModal>
    )
}