// 发布订阅
let fs = require('fs')
let school ={} 
let e = {
    //订阅
    arr:[],
    on(fn){
        this.arr.push(fn)
    },
    // 发布事件
    emit(){
        this.arr.forEach((item)=>{
            item()
        })
    },
}
// 订阅事件
e.on(()=>{
    console.log("ok")
})
e.on(()=>{
    if(Object.keys(school).length === 2){
        console.log(school)
    }
})
fs.readFile('./data/name.txt','utf8',(err,data)=>{
    school["name"] = data;
    e.emit();
})

fs.readFile('./data/age.txt','utf8',(err,data)=>{
    school["age"] = data;
    e.emit();
})