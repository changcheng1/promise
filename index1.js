/*
 * @Author: your name
 * @Date: 2020-03-19 22:30:11
 * @LastEditTime: 2020-03-22 16:27:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webNotes/Users/changcheng/Downloads/promise/index1.js
 */
// Promise是一个类
// 1) 每次执行Promise都需要传递一个执行器，执行器是立即执行的
// 2) 执行器中有两个参数，resolve,reject
// 3) 默认promise有三个状态 pedding,resolve,reject
// 4) 如果一旦成功 不能变成失败，一但失败，不能变成成功
// 5) 每个Promise都有一个then方法
let Promise = require('./simplePromise')
let P = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('6666')
    }, 1500)
})

P.catch(err => {
    console.log(err)
})