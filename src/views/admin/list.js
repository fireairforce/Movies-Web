import React, {
  useEffect,
  useState
} from 'react';
import {
  request
} from '../../lib';
import Layout from '../../layouts/default';
import {
  Table,
  Button
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const site = 'http://wdlj.zoomdong.xin/';

export default function List(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: '海报',
      dataIndex: 'posterKey',
      key: 'posterKey',
      render: (text, record) => (<img width="160" src={site + record.posterKey} />)
    }, {
      title: '名字',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '原始名',
      dataIndex: 'rawTitle',
      key: 'rawTitle',
    }, {
      title: '上映时间',
      dataIndex: 'pubdate',
      key: 'pubdate',
      render: (text, record) => (
        record.pubdate.map((it, i) => (
          <p key={i}>{moment(it.date).format('YYYY-MM-DD')} {it.country}</p>
        ))
      )
    },
    {
      title: '评分',
      dataIndex: 'rate',
      key: 'rate'
    },
    {
      title: '更新时间',
      dataIndex: 'meta',
      key: 'meta',
      render: (text, record) => (<span>{moment(record.meta.createdAt).fromNow(true)} 前</span>)
    },
    {
      title: '豆瓣 ID',
      dataIndex: 'doubanId',
      key: 'doubanId'
    },
    {
      title: '类型',
      dataIndex: 'movieTypes',
      key: 'movieTypes',
      render: (text, record) => (
        record.movieTypes.map((it, i) => (
          <p key={i}>{it}</p>
        ))
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (text, record) => (
        record.tags.map((it, i) => (
          <p key={i}>{it}</p>
        ))
      )
    },
    {
      title: '简要',
      key: 'summary',
      render: (text, record) => <p style={{padding: '5px', maxWidth: '800px'}}>{record.summary}</p>
    },
    {
      title: '详情',
      key: '_id',
      render: (text, record) => <a href={`/detail/${record._id}`} target={'_blank'}>详情</a>
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => <Button type="danger" onClick={()=>_deleteMovies(record._id)}>删除</Button>
    }
  ]

  const _deleteMovies = (id) => {
    request({
      method:'delete',
      url: `/admin/movies?id=${id}`
    }).then((res)=>{
      let tempArr=JSON.parse(JSON.stringify(res));
      tempArr.length === 0 ? [] : tempArr.map((item,index)=>{
        item.key = index;
        return item;
      })
      setDataSource(tempArr)
    }).catch(()=>{
      setDataSource([]);
    })
  }

  const _getAllMovies = () => {
    request({
      method:'get',
      url:'/admin/movie/list',
    }).then((res)=>{
      // let tempArr=JSON.parse(JSON.stringify(res));
      // tempArr.length === 0 ? [] : tempArr.map((item,index)=>{
      //   item.key = index;
      //   return item;
      // })
      res?res.length===0?[]:res.map((item,index)=>{
         item.key = index;
         return item;
      }):[]
      setDataSource(res)
    }).catch(()=>{
      setDataSource([]);
    })
  } 

  useEffect(()=>{
    _getAllMovies();
  },[]); 

  return(
    <Layout {...props}>
        <div className='flex-row full'>
          <div className='flex-1 scroll-y align-self-start'>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
    </Layout>
  )
}