import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Image from 'antd/lib/image';
import Typography from 'antd/lib/typography'
import Space from 'antd/lib/space'
import Button from '../shared/Button'
import Input from '../shared/Input'
import { login } from '../../states/auth/actions';
import Logo from '../../assets/images/logo.png'

import './index.scss'

export default function Login(){
    const navigate = useNavigate()

   const dispatch = useDispatch()
 
   const {isLoggingIn, isLoginRejected} = useSelector(state => state.auth)
 
   useEffect(() => { 
     isLoginRejected && message.error('Incorrect Email/Password')
   }, [isLoginRejected])
 
   function onSubmit(credentials) {
    credentials.email = credentials.email.trim() 
    dispatch(login(credentials, navigate, message))
   }
   
   const [form] = Form.useForm()
 
    return (
        <main className="login">
          <Form layout="vertical" form={form} onFinish={onSubmit} hideRequiredMark scrollToFirstError>
      
          <div className="login-header">
          <Image src={Logo} alt='logo' className="logo" preview={false}/>
          <Typography.Title level={1} className="title">Church name</Typography.Title>
          <Typography.Paragraph className="sub-title">“Church description/qoute”</Typography.Paragraph>
          </div>
          <Form.Item
          label='Email'
          name="email"
          rules={[{ required: true, message: "Email Required" }]}
          >
          <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
          label='Password'
          name="password"
          rules={[{ required: true, message: "Password Required" }]}
          >
          <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item>
          <Button htmlType="submit" loading={isLoggingIn} type='primary'>Login</Button>
          </Form.Item>
          </Form>
        </main>
    )
}