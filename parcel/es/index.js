import React from 'react'
import ReactDom  from 'react-dom'
import App from './app'

class AppContainer extends React.Component{
   state = {
       name : 'Parcel 打包 React 案例'
   }
   componentDidMount(){
       setTimeout(()=>{
           this.setState({
               name:'Parcel 打包成功!'
           })
       },2000)
   }
   render(){
       return <App name = {this.state.name} />
   }
}

ReactDom.render(
    <AppContainer />,
    document.getElementById('app')
)

