import React from 'react';
import Layout from '../../layouts/default';
import Content from './content';
import { request } from '../../lib';
import { Menu } from 'antd';
export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
       collapsed: false,
      selectedKey: '0',
      years: ['2025','2024','2023','2022','2021','2020','2019','2018'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: []
    }
  }
  componentDidMount(){
    this._getAllmovies();
  }

  _getAllmovies = () => {
    request(window._LOADING_)({
      method:'get',
      url:`api/v0/movies?type=${this.state.type || ''}&year=${this.state.year || ''}`
    }).then(res => {
      this.setState({
        movies: res
      }).catch(()=>{
        this.setState({
          movies: []
        })
      })
    })
  }

  _renderContent = () => {
    const { movies } = this.state;
    if(!movies || !movies.length) return null;
    return(
      <Content movies = {movies}/>
    )
  }

  _selectItem = ({ key }) => {
     this.setState({
       selectedKeys:key
     })
  }
   
  render(){
    const { years,selectedKeys,collapsed } = this.state;
    return(
      <Layout {...this.props}>
        <div className="flex-row full">
          <Menu
            defaultSelectedKeys={[selectedKeys]}
            mode='inline'
            inlineCollapsed={collapsed}
            style ={{height:'100%',overflowY:'scroll',maxWidth:'230px'}}
            // 点击选中的时候
            onSelect ={this._selectItem}
            className="align-self-start"
          >
          {
            years.map((item,index)=>(
              <Menu.Item key={index}>
                <a href={`/year/${item}`}>{item} 年上映</a>
              </Menu.Item>
            ))
          }
          </Menu>
          <div className="flex-1 scroll-y align-self-start">
            {this._renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}