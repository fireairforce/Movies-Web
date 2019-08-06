import React from 'react'
import Loadable from 'react-loadable';

function Loading({ error }) {
  if(error){
    return 'Opps Error!!';
  } else {
    return <h3>页面正在加载中，不要慌张</h3>
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
  },
] 


