class Boy{
  @speack('中文')
  run (){
    console.log('I can say' + this.language);
    console.log('I can run!');
  }
}

function speack(language){
  return function(target,key,descriptor){
    console.log(target);
    console.log(key);
    console.log(descriptor);
    target.language = language;
    return descriptor;
  }
}
const wd = new Boy();
wd.run();