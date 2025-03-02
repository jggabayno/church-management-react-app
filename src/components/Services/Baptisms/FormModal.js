import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import Select from 'antd/lib/select'
import Descriptions from 'antd/lib/descriptions'
import Avatar from 'antd/lib/avatar'
import moment from 'moment'
import Button from '../../shared/Button'
import Input from '../../shared/Input'
import FormModal from '../../shared/FormModal'
import CSelect from '../../shared/Select'

import { useReactToPrint } from "react-to-print";
import { useRef, useState, useCallback } from 'react'

import { PrinterOutlined } from '@ant-design/icons'
import Steps from 'antd/lib/steps'
import List from 'antd/lib/list'

export default function FormModalUser(props) {

  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleOnBeforeGetContent = useCallback(() => {
    setIsLoading(true);
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 2000);
    });
  }, [setIsLoading]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    // documentTitle: "Wedding Certificate",
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true
  });

  const disabledDate = (current) => current <= moment().subtract(1, "days")

  const { processConfig, baptismalProcess, setBaptismalProcess } = props

  function isProcess(processType) {
    return processType === baptismalProcess
  }

  function StepsSettings() {
    return (
      <Steps current={baptismalProcess} className='service-steps'>
        <Steps.Step title="Requirements" />
        <Steps.Step title="Fill Up Form" />
        <Steps.Step title="Payment" />
      </Steps>
    )
  }

  const footer = isProcess(processConfig.payment) ? [
    <Button key={1} type='ghost' onClick={() => setBaptismalProcess(prev => prev - 1)} disabled={baptismalProcess === 1}>Back</Button>,
    <Button key={2} type='ghost' onClick={props.closeModal}>Cancel</Button>,
    <Button key={3} form='form-baptism' type='primary' htmlType='submit' loading={isLoading}>Save</Button>
  ] : [
    <Button key={1} type='ghost' onClick={() => setBaptismalProcess(prev => prev - 1)} disabled={baptismalProcess === 1}>Back</Button>,
    isProcess(processConfig.requirements) ? <Button key={2} onClick={() => setBaptismalProcess(prev => prev + 1)} loading={isLoading}>Next</Button> :
      <Button key={3} form='form-baptism' type='primary' htmlType='submit' loading={isLoading}>Next</Button>
  ]

  const newProps = {
    ...props,
    footer
  }

  function ServiceFee() {

    const row = props.serviceFee.find(row => row.name !== 'Baptism')

    const details = JSON.parse(row.details)

    const total = details?.map((row, key) => Number(row[`value${key}`])).reduce((a, c) => a + c, 0).toLocaleString()

    if (!details) return <>N/A</>

    return (
      <div>


        <List
          size="small"
          header={<h3>Payment</h3>}
          bordered
          dataSource={details}
          renderItem={(r, k) => {
            const key = r[`key${k}`]
            const value = Number(r[`value${k}`]).toLocaleString()
            return <List.Item><span>{key}:</span> <span>&#8369; {value}</span></List.Item>
          }}
          footer={<div><span>Total: </span><span> &#8369;{total}</span></div>}
        />
      </div>
    )

  }

  function formItems() {
    return (
      <>
        <Form.Item
          name="person_id"
          label="User"
          rules={[{ required: true, message: 'User is Required' }]}
        >
          <CSelect placeholder="Select User" disabled={props.actionType === 'edit'}>
            {(props.actionType === 'edit' ? props.users : props.validatedUsers).map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
          </CSelect>
        </Form.Item>

        <Form.Item label="Fathers Name" name="fathers_maiden_name"
          rules={[{ required: true, message: "Fathers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mothers Maiden Name" name="mothers_maiden_name"
          rules={[{ required: true, message: "Mothers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="pastor_id"
          label="Pastor"
          rules={[{ required: true, message: 'Pastor is Required' }]}
        >
          <CSelect placeholder="Select Pastor">
            {props.users.filter(user => Number(user.position_id) === 4).map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
          </CSelect>
        </Form.Item>

        <Form.Item label="Date of Baptism" name="date_of_baptism"
          rules={[{ required: true, message: "Date of Baptism is Required" }]}
        >
          <DatePicker size='large' disabledDate={disabledDate} />
        </Form.Item>
      </>
    )
  }

  return (
    <FormModal {...newProps} formId='form-baptism' modalTitle='Baptism' customAddModeTitle='Application of Baptism'>

      {props.actionType === 'view' &&
        <div className='user-view'>
          <Descriptions title='User' column={2} className='detail-descriptions baptism-person-detail'>
            <Descriptions.Item label="Photo" className='desc-label-photo' span={2}><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + props?.selectedBaptism?.person?.photo} alt='user' /></Descriptions.Item>
            <Descriptions.Item label="Name" >{`${props?.selectedBaptism?.person?.first_name} ${props?.selectedBaptism?.person?.middle_name} ${props?.selectedBaptism?.person?.last_name}`}</Descriptions.Item>
            <Descriptions.Item label="Mobile Number" >{props?.selectedBaptism?.person?.mobile_number}</Descriptions.Item>
            <Descriptions.Item label="Email" >{props?.selectedBaptism?.person?.email}</Descriptions.Item>
            <Descriptions.Item label="Age" >{props?.selectedBaptism?.person?.age}</Descriptions.Item>
            <Descriptions.Item label="Gender" >{Number(props?.selectedBaptism?.person?.gender) === 1 ? 'Male' : 'Female'}</Descriptions.Item>
            <Descriptions.Item label="Citizenship" >{props?.selectedBaptism?.person?.citizenship === 1 ? 'Filipino' : 'Other'}</Descriptions.Item>
            <Descriptions.Item label="Occupation" >{props?.selectedBaptism?.person?.occupation}</Descriptions.Item>
            <Descriptions.Item label="Birth Date" >{moment(props?.selectedBaptism?.person?.middle_name?.birth_date).format('LL')}</Descriptions.Item>
            <Descriptions.Item label="Place of Birth" >{props?.selectedBaptism?.person?.place_of_birth}</Descriptions.Item>
            <Descriptions.Item label="Father's Name" >{props?.selectedBaptism?.person?.fathers_maiden_name}</Descriptions.Item>
            <Descriptions.Item label="Mother's Maiden Name" >{props?.selectedBaptism?.person?.mothers_maiden_name}</Descriptions.Item>
          </Descriptions>
          <Descriptions title='Baptism Detail' column={2} className='detail-descriptions baptism-detail'>
            <Descriptions.Item label="Pastor" >{`${props?.selectedBaptism?.pastor?.first_name} ${props?.selectedBaptism?.pastor?.last_name}`}</Descriptions.Item>
            <Descriptions.Item label="Date of Application" >{moment(props?.selectedBaptism?.created_at).format('LL hh:mm A')}</Descriptions.Item>
            <Descriptions.Item label="Date of Baptism" >{moment(props?.selectedBaptism?.date_of_baptism).format('LL hh:mm A')}</Descriptions.Item>
          </Descriptions>
        </div>
      }

      {props.actionType === 'view' &&
        <section ref={componentRef} className='baptism-certification'>
          <div className='certification-highlight'>
            <h1>Certificate of Baptism</h1>
            <p>This is to certifiy that</p>
            <p><span className='certification-person-name'>{`${props?.selectedBaptism?.person?.first_name} ${props?.selectedBaptism?.person?.middle_name} ${props?.selectedBaptism?.person?.last_name}`}</span></p>
            <p>was Baptized/Christianized at _location_ on</p>
            <span className='certification-date-baptism'>{moment(props?.selectedBaptism?.date_of_baptism).format('LL')}</span>
          </div>
          <div className='certification-pastor-with-signature'>
            <span>Signed, Pastor {`${props?.selectedBaptism?.pastor?.first_name} ${props?.selectedBaptism?.pastor?.last_name}`}</span>
            <span>Officiating Minister</span>
          </div>
        </section>
      }


      {props.actionType === 'view' &&
        <div className='btn-print-container'>
          <Button type='primary' loading={isLoading} onClick={handlePrint} className='btn-print'><PrinterOutlined /> Print Certificate</Button>
        </div>}

      {props.actionType === 'edit' && formItems()}

      {props.actionType === 'add' &&
        <>
          <StepsSettings />

          {
            isProcess(processConfig.requirements) &&
            <div className='requirements'>

              <List
                size="small"
                header={<h3>The applicant must have the following requirements</h3>}
                bordered
                dataSource={['Valid ID', 'Birth Certificate']}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </div>
          }


          {
            isProcess(processConfig.form) && formItems()
          }

          {
            isProcess(processConfig.payment) && <div>
              <ServiceFee />
              <div style={{ height: 0, overflow: 'hidden' }}>
                {formItems()}
              </div>
            </div>
          }
        </>
      }


    </FormModal>
  )
}