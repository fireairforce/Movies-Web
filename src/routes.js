import React from 'react'
import Loadable from 'react-loadable';
import { Spin } from 'antd';

function Loading({ error }) {
  if(error){
    return 'Opps Error!!';
  } else {
    return <Spin size="large">加载中</Spin>
  }
}

const Home = Loadable({
  loader: () => import('./views/home'),
  loading: Loading
})

const Detail = Loadable({
  loader: () => import('./views/movie/detail'),
  loading: Loading
})

const Login = Loadable({
  loader: () => import('./views/admin/login'),
  loading: Loading
})

export default [
  {
    name:'首页',
    icon:'home',
    path:'/',
    component: Home
  },{
    name:'详情页',
    path:'/detail/:id',
    component: Detail
  },{
    name:'后台入口',
    path:'/admin',
    icon:'admin',
    component: Login
  }
] 


