import React , { Component } from 'react';
import { Row,Card, Col, Badge,Icon } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const site = 'http://wdlj.zoomdong.xin/';
const Meta = Card.Meta;

export default class Content extends Component{
  
  _renderContent = () => {
    const { movies } = this.props;
    
    return(
      <div style={{ padding: '30px' }}>
         <Row>
           {
             movies.map((item,index)=>(
               <Col
                 key = {`${item}${index}`}
                 xl={{span:6}}
                 lg={{span:8}}
                 md={{span:12}}
                 sm={{span:24}}
                 style={{marginBottom:'8px'}}
               >
                 <Card
                   bordered={false}
                   hoverable
                   style={{width:'100%'}}
                   actions={[
                     <Badge>
                       <Icon style={{ marginRight:'2px' }} type='clock-circle'/>
                       {moment(item.meta.createdAt).fromNow(true)}
                     </Badge>,
                     <Badge>
                       <Icon style={{marginRight:'2px'}} type='star'/>
                       {item.rate} 分 
                     </Badge>
                   ]}
                   cover={<img 
                    
                    src={site + item.posterKey + '?imageMongr2/thumbnail/x1680/crop/1080×1600'}/>}
                 >
                   <Meta 
                     style = {{ height:'202px',overflow:'hidden' }}
                     title={<Link to={`/detail/${item._id}`} >{item.title}</Link>}
                     description={<Link to={`/detail/${item._id}`} >{item.summary}</Link>}
                   />
                 </Card>
               </Col>
             ))
           }
         </Row>
      </div>
    )
  }
  
  render(){
    // console.log(this.props);
    return(
      <div style={{ padding: 10 }}>
         { this._renderContent() }
      </div>
    )
  }
}