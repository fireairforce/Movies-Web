import React,{ useEffect, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { request } from '../../lib';
import './login.sass';
// 为了支持es6的写法
import "babel-polyfill";
const FormItem = Form.Item;

function Login(props){
  const [ loading , setLoading ] = useState(false);

  function _toggleLoading(){
     setLoading(false);
  }
  
  function handleSubmit(e){
    e.preventDefault();
    props.form.validateFields(async (err,values)=>{
      if(!err){
        request(_toggleLoading)({
          method:'post',
          url:'/admin/login',
          data: {
            ...values
          }
        }).then(res=>{
          // console.log(res);
          if(res&&res.sucess===false){
            return;
          } else {
            console.log(props.history);
            props.history.replace('/admin/list')
          }
        })
      }
    })
  }

  const { getFieldDecorator } = props.form; 
  return(
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
          <h3 style={{textAlign: 'center'}}>网站管理后台</h3>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }]
            })(
              <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Email' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password!' }]
            })(
              <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='Password' />
            )}
          </FormItem>
          <FormItem>
            <Button 
              style={{ width: '100%' }} 
              htmlType='submit' 
              loading={loading}
              type="primary"
            >
              Log in
            </Button>
          </FormItem>
        </Form>
    </div>
  )
}

export default Form.create()(Login);