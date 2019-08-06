import React ,{ Component } from 'react';
import { Menu , Spin } from 'antd';
import { Link } from 'react-router-dom';
import navRoutes from './../nav';

const MenuItem = Menu.Item;
const getMenuContent = ({ path,name }) => (
  <a href={path? path : '/'} style = {{color: '#fff2e8'}}>
    { name }
  </a>
)

export default class LayoutDefault extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      tip:'再等一下'
    }
  }
  componentDidMount(){
    window._LOADING_ = this.toggeleLoading;
  }

  componentWillUnmount(){
    window._LOADING_ = null;
  }
  matchRouteName = this.props.match ? navRoutes.find(e=> e.name === this.props.match.params.type) ? navRoutes.find(e=> e.name === this.props.params.type).name : '全部' : navRoutes[0].name
  toggeleLoading = (state = false, tip = '再等一下下~') => {
    this.setState({
      tip,

    })
  }
   render(){
     const { children } = this.props;
     const { loading ,tip } = this.state;
     return(
       <div className = "flex-column" style ={{width:'100%',height:'100%'}}>
         <Menu
           style = {{ fontSize:'13.5px',backgroundColor:'#000' }}
           mode="horizontal"
           defaultSelectedKeys={[this.matchRouteName]}
         >
          <MenuItem 
           style ={{
             marginLeft: '24px',
             marginRight: '30px',
             fontSize:'18px',
             textAlign:'center',
             color:'#fff !important',
             float:'left'
           }}
          >
            <a href={'/'} className='hover-scale logo-text' style={{ color:'#fff2e8' }}>KOA2学习构造</a>
          </MenuItem> 
          {
            navRoutes.map((item,key)=>(
              <MenuItem key={item.name}>
                 {
                   getMenuContent({...item})
                 }
              </MenuItem>
            ))
          }
          </Menu>
          <Spin
            spinning = {loading}
            tip = {tip}
            wrapperClassName = 'content-spin full'
          >
             { children }
          </Spin>
       </div>
     )
   }
}