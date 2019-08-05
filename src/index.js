import './assets/common.sass'

function changeTitle(){
  window.$('#app').html('Parcel Case')
}

setTimeout(function(){
  changeTitle()
},2000)