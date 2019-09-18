// Promise是一个类
// 1) 每次执行Promise都需要传递一个执行器，执行器是立即执行的
// 2) 执行器中有两个参数，resolve,reject
// 3) 默认promise有三个状态 pedding,resolve,reject
// 4) 如果一旦成功 不能变成失败，一但失败，不能变成成功
// 5) 每个Promise都有一个then方法
let Promise = require('./simplePromise.js')
let P = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject("错误了")
    },1000)
})  
P.then(data=>{
    console.log("data:",data)
},err=>{
    console.log("err:",err)
})

P.then(data=>{
    console.log("data:",data)
},err=>{
    console.log("err:",err)
})