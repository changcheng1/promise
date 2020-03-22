/*
 * @Author: your name
 * @Date: 2020-03-19 17:14:41
 * @LastEditTime: 2020-03-19 20:53:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webNotes/Users/changcheng/Downloads/promise/demo.js
 */
const fs = require('fs')

// promise的链式调用
// 链式调用 如果返回一个普通值 会走下一个then成功
// 抛出错误 then失败的方法
// 如果是promise，就执行promise执行采用他的状态
// 返回了一个新的promise链式调用
function readFile(name) {
    return new Promise((resolve, reject) => {
        fs.readFile(name, 'Utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
}

readFile('name.text').then(data => {
    return data
}).then((data) => {
    return readFile(data)
}).then(data => {
    console.log(data)
})