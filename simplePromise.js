/*
 * @Author: your name
 * @Date: 2020-03-19 16:23:45
 * @LastEditTime: 2020-03-22 16:28:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webNotes/Users/changcheng/Downloads/promise/simplePromise.js
 */
const PEDDING = 'pedding'
const REJECTED = 'rejected'
const FULFILLED = 'fufilled'
    // then 中可能返回的promise处理
const resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) { // 自己等待自己完成
        return reject(new TypeError(`引用的Promise为同一个promise`))
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called;
        // 可能是promise 如果没有promise.then
        try {
            let then = x.then() // 看一看有没有then方法
            then.call(x, y => { // 如果是一个promise，就采用这个promise的结果
                // y 有可能还是一个promise所以递归解析
                if (called) return;
                called = true
                resolvePromise(promise2, y, resolve, reject)
            }, r => {
                if (called) return; // 防止多次调用
                called = true
                reject(rs)
            })
        } catch (e) {
            if (called) return; // 防止多次调用
            called = true
            reject(e) // 没有就抛出错误
        }
    } else {
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.value = undefined;
        this.reson = undefined;
        this.status = PEDDING;
        // 用于异步订阅
        this.onResolveCallBacks = []
        this.onRejectCallBacks = []
        let resolve = (val) => {
            if (this.status == PEDDING) {
                this.value = val;
                this.status = REJECTED
                    // 发布
                this.onResolveCallBacks.forEach(fn => fn())
            }
        }
        let reject = (res) => {
                if (this.status == PEDDING) {
                    this.reson = res
                    this.status = FULFILLED
                        // 发布
                    this.onRejectCallBacks.forEach(fn =>
                        fn()
                    )
                }
            }
            // 捕获new Promise时发生的错误
        try {
            // 直接执行promise函数
            executor(resolve, reject)
        } catch (err) {
            // 如果捕获到错误直接抛出错误
            reject(err)
        }
    }
    then(onRejected, onFulfilled) {
        // then方法之后应该返回一个新的promise
        let promise2 = new Promise((resolve, reject) => {
            // 应该在返回的promise中，取到上一次的状态，来决定promise2是成功还是失败
            if (this.status == REJECTED) {
                // 当前的onFufilled，onRejected不能在当前的上下文当中执行，为了确保promise2执行完毕
                setTimeout(() => {
                    try {
                        let x = onRejected(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                        resplve(x)
                    } catch (e) {
                        reject(e)
                    }
                })

            }
            if (this.status == FULFILLED) {
                try {
                    let x = onFulfilled(this.reson)
                    resplve(x)
                } catch (e) {
                    reject(e)
                }
            }
            // 执行then的时候如果有异步任务还没有结束，就放到相对应的订阅队列当中，等待执行
            if (this.status == PEDDING) {
                this.onResolveCallBacks.push(() => {
                    try {
                        let x = onRejected(this.value)
                        resolve(x)
                    } catch (e) {
                        reject(e)
                    }

                });
                this.onRejectCallBacks.push(() => {
                    try {
                        let x = onFulfilled(this.reson)
                        resolve(x)
                    } catch (e) {
                        reject(e)
                    }

                })
            }

        });
        return promise2
    }
    catch (catchCallBack) { // promise的cath的实现实际上是没有错误的then
        return this.then(null, catchCallBack)
    }
}
module.exports = Promise