import React , { Component } from 'react';
import { Row,Card, Col, Badge,Icon,Modal,Spin } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const site = 'http://wdlj.zoomdong.xin/';
const Meta = Card.Meta;
const DPlayer = window.DPlayer
export default class Content extends Component{
  
   state = {
     visible:false
   }
   
   _handleCancel = (e) => {
    this.setState({
      visible:false
    })
   }

   _handleClose = (e) => {
    if(this.player && this.player.pause){
      this.player.pause();
    }
   }

   _showModal = (movie) => {
     this.setState({
       visible:true
     })
     const video = site + movie.videoKey
     const pic = site + movie.coverKey
     if(!this.player){
      //  增加演示放置弹窗没有被渲染到dom结构中去
       setTimeout(()=>{
          this.player = new DPlayer({
            container: document.getElementsByClassName('videoModal')[0],
            screenshot: true,
            // 自动播放
            autoplay: true,
            video:{
              url:video,
              pic:pic,
              thumbnails: pic
            }
          })
       },500)
     } else {
       if(this.player.video.currentSrc !== video){
         this.player.switchVideo({
           url:video,
           autoplay: true,
           pic:pic,
           type:'auto'
         })
       }
       this.player.play();
     }
   }

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
                    onClick = {()=>{
                      this._showModal(item)
                    }}
                    //   这里对图片的处理使用了七牛的图片剪裁功能
                    src={site + item.posterKey + '?imageMogr2/thumbnail/x1680/crop/1080x1600'} />}
                 >
                   {/* 标题和描述 */}
                   <Meta 
                     onClick={()=>{this.props.history.push(`/detail/${item._id}`)}}
                     style = {{ height:'202px',overflow:'hidden' }}
                     title={<Link to={`/detail/${item._id}`} >{item.title}</Link>}
                     description={<Link to={`/detail/${item._id}`} >{item.summary}</Link>}
                   />
                 </Card>
               </Col>
             ))
           }
         </Row>
         <Modal
           className='videoModal'
           footer={null}
           afterClose={this._handleClose}
           visible={this.state.visible}
           onCancel={this._handleCancel}
         >
           <Spin size="large"/>
         </Modal>
      </div>
    )
  }
  
  render(){
    return(
      <div style={{ padding: '10px' }}>
         { this._renderContent() }
      </div>
    )
  }
}