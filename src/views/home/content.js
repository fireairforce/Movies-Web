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
                 key = {`${item.rate}${index}`}
                 xl={{span:6}}
                 lg={{span:8}}
                 md={{span:12}}
                 sm={{span:24}}
                 style={{marginBottom:'8px'}}
               >
                 <Card
                   bordered={false}
                   hoverable
                   style={{ width:'100%' }}
                   actions={[
                      //  这里放更新时间
                     <Badge>
                       <Icon style={{ marginRight:'2px' }} type='clock-circle'/>
                       {moment(item.meta.createdAt).fromNow(true) }
                       前更新
                     </Badge>,
                     <Badge>
                       <Icon style={{marginRight:'2px'}} type='star'/>
                       {item.rate} 分 
                     </Badge>
                   ]}
                   cover={
                   <img  
                    //   这里对图片的处理使用了七牛的图片剪裁功能
                    src={site + item.posterKey + '?imageMogr2/thumbnail/x1680/crop/1080x1600'} />}
                 >
                   {/* 标题和描述 */}
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
      <div style={{ padding: '10px' }}>
         { this._renderContent() }
      </div>
    )
  }
}