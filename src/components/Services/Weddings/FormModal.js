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
import { useRef, useState, useCallback, forwardRef } from 'react'

import { PrinterOutlined } from '@ant-design/icons'
import Steps from 'antd/lib/steps'
import List from 'antd/lib/list'

const WeddingViewDetail = forwardRef((props, ref) => (
  <div className='groom-bride-view' ref={ref}>
    <Descriptions title='Groom' column={2} className='detail-descriptions wedding-groom-detail'>
      <Descriptions.Item label="Photo" className='desc-label-photo' span={2}><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + props?.selectedWedding?.groom?.photo} alt='user' /></Descriptions.Item>
      <Descriptions.Item label="Name" >{`${props?.selectedWedding?.groom?.first_name} ${props?.selectedWedding?.groom?.middle_name} ${props?.selectedWedding?.groom?.last_name}`}</Descriptions.Item>
      <Descriptions.Item label="Mobile Number" >{props?.selectedWedding?.groom?.mobile_number}</Descriptions.Item>
      <Descriptions.Item label="Email" >{props?.selectedWedding?.groom?.email}</Descriptions.Item>
      <Descriptions.Item label="Age" >{props?.selectedWedding?.groom?.age}</Descriptions.Item>
      <Descriptions.Item label="Gender" >{props?.selectedWedding?.groom?.gender === 1 ? 'Male' : 'Female'}</Descriptions.Item>
      <Descriptions.Item label="Citizenship" >{props?.selectedWedding?.groom?.citizenship === 1 ? 'Filipino' : 'Other'}</Descriptions.Item>
      <Descriptions.Item label="Occupation" >{props?.selectedWedding?.groom?.occupation}</Descriptions.Item>
      <Descriptions.Item label="Birth Date" >{moment(props?.selectedWedding?.groom?.middle_name?.birth_date).format('LL')}</Descriptions.Item>
      <Descriptions.Item label="Place of Birth" >{props?.selectedWedding?.groom?.place_of_birth}</Descriptions.Item>
      <Descriptions.Item label="Father's Name" >{props?.selectedWedding?.groom?.fathers_maiden_name}</Descriptions.Item>
      <Descriptions.Item label="Mother's Maiden Name" >{props?.selectedWedding?.groom?.mothers_maiden_name}</Descriptions.Item>
    </Descriptions>
    <Descriptions title='Bride' column={2} className='detail-descriptions wedding-bride-detail'>
      <Descriptions.Item label="Photo" className='desc-label-photo' span={2}><Avatar size={100} src={process.env.REACT_APP_API_USER_PHOTO + props?.selectedWedding?.bride?.photo} alt='user' /></Descriptions.Item>
      <Descriptions.Item label="Name" >{`${props?.selectedWedding?.bride?.first_name} ${props?.selectedWedding?.bride?.middle_name} ${props?.selectedWedding?.groom?.last_name}`}</Descriptions.Item>
      <Descriptions.Item label="Mobile Number" >{props?.selectedWedding?.bride?.mobile_number}</Descriptions.Item>
      <Descriptions.Item label="Email" >{props?.selectedWedding?.bride?.email}</Descriptions.Item>
      <Descriptions.Item label="Age" >{props?.selectedWedding?.bride?.age}</Descriptions.Item>
      <Descriptions.Item label="Gender" >{props?.selectedWedding?.bride?.gender === 1 ? 'Male' : 'Female'}</Descriptions.Item>
      <Descriptions.Item label="Citizenship" >{props?.selectedWedding?.bride?.citizenship === 1 ? 'Filipino' : 'Other'}</Descriptions.Item>
      <Descriptions.Item label="Occupation" >{props?.selectedWedding?.bride?.occupation}</Descriptions.Item>
      <Descriptions.Item label="Birth Date" >{moment(props?.selectedWedding?.bride?.middle_name?.birth_date).format('LL')}</Descriptions.Item>
      <Descriptions.Item label="Place of Birth" >{props?.selectedWedding?.bride?.place_of_birth}</Descriptions.Item>
      <Descriptions.Item label="Father's Name" >{props?.selectedWedding?.bride?.fathers_maiden_name}</Descriptions.Item>
      <Descriptions.Item label="Mother's Maiden Name" >{props?.selectedWedding?.bride?.mothers_maiden_name}</Descriptions.Item>
    </Descriptions>
    <Descriptions title='Wedding Detail' column={2} className='detail-descriptions wedding-detail'>
      <Descriptions.Item label="Pastor" >{`${props?.selectedWedding?.pastor?.first_name} ${props?.selectedWedding?.pastor?.last_name}`}</Descriptions.Item>
      <Descriptions.Item label="Location" >{`${props?.selectedWedding?.location}`}</Descriptions.Item>
      <Descriptions.Item label="Date of Seminar" >{moment(props?.selectedWedding?.date_of_seminar).format('LL')}</Descriptions.Item>
      <Descriptions.Item label="Date Schedule of Marriage" >{moment(props?.selectedWedding?.date_schedule_of_marriage).format('LL')}</Descriptions.Item>
    </Descriptions>
  </div>
))

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

  const { processConfig, weddingProcess, setWeddingProcess } = props


  function isProcess(processType) {
    return processType === weddingProcess
  }

  function StepsSettings() {
    return (
      <Steps current={weddingProcess} className='service-steps'>
        <Steps.Step title="Requirements" />
        <Steps.Step title="Fill Up Form" />
        <Steps.Step title="Payment" />
      </Steps>
    )
  }

  const footer = isProcess(processConfig.payment) ? [
    <Button key={1} type='ghost' onClick={() => setWeddingProcess(prev => prev - 1)} disabled={weddingProcess === 1}>Back</Button>,
    <Button key={2} type='ghost' onClick={props.closeModal}>Cancel</Button>,
    <Button key={3} form='form-wedding' type='primary' htmlType='submit' loading={isLoading}>Save</Button>
  ] : [
    <Button key={1} type='ghost' onClick={() => setWeddingProcess(prev => prev - 1)} disabled={weddingProcess === 1}>Back</Button>,
    isProcess(processConfig.requirements) ? <Button key={2} onClick={() => setWeddingProcess(prev => prev + 1)} loading={isLoading}>Next</Button> :
      <Button key={3} form='form-wedding' type='primary' htmlType='submit' loading={isLoading}>Next</Button>
  ]

  const newProps = {
    ...props,
    footer
  }

  function ServiceFee() {

    const row = props.serviceFee.find(row => row.name === 'Wedding')

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
          name="bride_id"
          label="Bride"
          rules={[{ required: true, message: 'Bride is Required' }]}
        >
          <CSelect placeholder="Select Bride" disabled={props.actionType === 'edit'}>
            {(props.actionType === 'edit' ? props.users : props.validatedUsers).filter(user => Number(user.gender) === 2).map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
          </CSelect>
        </Form.Item>

        <Form.Item
          name="groom_id"
          label="Groom"
          rules={[{ required: true, message: 'Groom is Required' }]}
        >
          <CSelect placeholder="Select Groom" disabled={props.actionType === 'edit'}>
            {(props.actionType === 'edit' ? props.users : props.validatedUsers).filter(user => Number(user.gender) === 1).map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
          </CSelect>
        </Form.Item>

        <Form.Item label="Bride Occupation" name="bride_occupation"
          rules={[{ required: true, message: "Bride Occupation is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Groom Occupation" name="groom_occupation"
          rules={[{ required: true, message: "Groom Occupation is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Bride Father's Name" name="bride_fathers_maiden_name"
          rules={[{ required: true, message: "Bride Fathers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Groom Father's Name" name="groom_fathers_maiden_name"
          rules={[{ required: true, message: "Groom Fathers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Bride Mothers Maiden Name" name="bride_mothers_maiden_name"
          rules={[{ required: true, message: "Bride Mothers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Groom Mothers Maiden Name" name="groom_mothers_maiden_name"
          rules={[{ required: true, message: "Groom Mothers Maiden Name is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="pastor_id"
          label="Pastor"
          rules={[{ required: true, message: 'Pastor is Required' }]}
        >
          <CSelect placeholder="Select Pastor">
            {props.validatedUsers.filter(user => Number(user.position_id) === 4).map(user => <Select.Option value={user.id} key={user.id}>{`${user.first_name} ${user.last_name}`}</Select.Option>)}
          </CSelect>
        </Form.Item>

        <Form.Item label="Location" name="location"
          rules={[{ required: true, message: "Location is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Date of Seminar" name="date_of_seminar"
          rules={[{ required: true, message: "Date of Seminar is Required" }]}
        >
          <DatePicker size='large' disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item label="Date schedule of marriage" name="date_schedule_of_marriage"
          rules={[{ required: true, message: "Date schedule of marriage is Required" }]}
        >
          <DatePicker size='large' disabledDate={disabledDate} />
        </Form.Item>
      </>
    )
  }

  return (
    <FormModal {...newProps} formId='form-wedding' modalTitle='Wedding' customAddModeTitle='Application of Marriage'>


      {props.actionType === 'view' && <WeddingViewDetail {...props} />}
      {props.actionType === 'view' &&
        <section ref={componentRef} className='wedding-certification'>
          <div className='certification-highlight'>
            <h1>Certificate of Marriage</h1>
            <p>This is to certifiy that</p>
            <p><span className='certification-couple-name'>{props?.selectedWedding?.bride?.first_name}</span> and <span className='certification-couple-name'>{props?.selectedWedding?.groom?.first_name}</span></p>
            <p>were United in Marriage at {`${props?.selectedWedding?.location} `}
              on</p>
            <span className='certification-date-married'>{moment(props?.selectedWedding?.date_schedule_of_marriage).format('LL')}</span>
          </div>
          <div className='certification-pastor-with-signature'>
            <span>Signed, Pastor {`${props?.selectedWedding?.pastor?.first_name} ${props?.selectedWedding?.pastor?.last_name}`}</span>
            <span>Officiating Minister</span>
          </div>
          <div className='certification-name-with-signature'>
            <div>
              <span>Bride</span>
              <span className='sns-name'>{`${props?.selectedWedding?.bride?.first_name} ${props?.selectedWedding?.groom?.last_name}`}</span>
            </div>
            <div>
              <span>Groom</span>
              <span className='sns-name'>{`${props?.selectedWedding?.groom?.first_name} ${props?.selectedWedding?.groom?.last_name}`}</span>
            </div>

          </div>
        </section>
      }
      {props.actionType === 'view' && <div className='btn-print-container'>
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
                header={<h3>The Bride & Groom must have the following requirements</h3>}
                bordered
                dataSource={['Valid ID', 'Certificate of Non-Marriage', 'Birth Certificate']}
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