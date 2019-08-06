import React from 'react';
import { Route,Switch } from 'react-router-dom';
import routes from './routes';
import 'antd/dist/antd.css';
// 引入公共的样式
import './assets/common.sass';

export default () => (
  <Switch>
    {
      routes.map(({ name,path,exact = true,component })=>(
        <Route path = {path} exact={exact} component = {component} key={name}/>
      ))
    }
  </Switch>
) 