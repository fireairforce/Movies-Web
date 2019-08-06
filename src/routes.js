import Home from './views/home';
import Detail from './views/movie/detail';

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


