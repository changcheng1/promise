/*
 * @Author: Promise Implementation
 * @Date: 2020-03-19 16:23:45
 * @LastEditTime: 2024-12-19 Updated
 * @LastEditors: Fixed Promise Implementation
 * @Description: Complete Promise/A+ specification implementation
 * @FilePath: promise/simplePromise.js
 */

// Promise 状态常量 - 修复拼写错误
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// 微任务队列模拟
const nextTick = (callback) => {
  if (typeof queueMicrotask !== "undefined") {
    queueMicrotask(callback);
  } else if (typeof process !== "undefined" && process.nextTick) {
    process.nextTick(callback);
  } else {
    setTimeout(callback, 0);
  }
};

// Promise 解析函数 - 处理 then 方法返回值
const resolvePromise = (promise2, x, resolve, reject) => {
  // 防止循环引用
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  // 处理 Promise 实例
  if (x instanceof Promise) {
    x.then(resolve, reject);
    return;
  }

  // 处理 thenable 对象
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false;

    try {
      // 获取 then 方法 - 修复错误：不应该调用 x.then()
      let then = x.then;

      if (typeof then === "function") {
        // 调用 then 方法
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // 递归解析，y 可能还是 Promise
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 不是 thenable，直接 resolve
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 普通值直接 resolve
    resolve(x);
  }
};
class Promise {
  constructor(executor) {
    // 验证 executor 参数
    if (typeof executor !== "function") {
      throw new TypeError("Promise resolver is not a function");
    }

    // 初始化状态和值
    this.value = undefined;
    this.reason = undefined; // 修复拼写错误：reson -> reason
    this.status = PENDING; // 修复状态常量：PEDDING -> PENDING

    // 异步回调队列 - 订阅发布模式
    this.onFulfilledCallbacks = []; // 成功回调队列
    this.onRejectedCallbacks = []; // 失败回调队列

    // resolve 函数 - 修复状态设置错误
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED; // 修复：原来错误地设置为 REJECTED

        // 发布 - 执行所有成功回调
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    // reject 函数 - 修复状态设置错误
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED; // 修复：原来错误地设置为 FULFILLED

        // 发布 - 执行所有失败回调
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 执行器错误捕获
    try {
      // 立即执行 executor
      executor(resolve, reject);
    } catch (error) {
      // 如果执行器抛出错误，直接 reject
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // 参数标准化 - 处理非函数参数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // then 方法返回新的 Promise 实现链式调用
    const promise2 = new Promise((resolve, reject) => {
      // 处理已完成状态 - 修复状态判断错误
      if (this.status === FULFILLED) {
        nextTick(() => {
          try {
            const x = onFulfilled(this.value); // 修复：使用正确的回调和值
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      // 处理已拒绝状态 - 修复状态判断错误
      if (this.status === REJECTED) {
        nextTick(() => {
          try {
            const x = onRejected(this.reason); // 修复：使用正确的回调和值
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      // 处理待定状态（异步情况）
      if (this.status === PENDING) {
        // 订阅成功回调 - 修复回调函数错误
        this.onFulfilledCallbacks.push(() => {
          nextTick(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        // 订阅失败回调 - 修复回调函数错误
        this.onRejectedCallbacks.push(() => {
          nextTick(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }
  catch(onRejected) {
    // catch 实际上是没有成功回调的 then
    return this.then(null, onRejected);
  }

  // finally 方法实现
  finally(onFinally) {
    return this.then(
      (value) => {
        return Promise.resolve(onFinally()).then(() => value);
      },
      (reason) => {
        return Promise.resolve(onFinally()).then(() => {
          throw reason;
        });
      }
    );
  }

  // 静态方法：Promise.resolve
  static resolve(value) {
    // 如果是 Promise 实例，直接返回
    if (value instanceof Promise) {
      return value;
    }

    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // 静态方法：Promise.reject
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  // 静态方法：Promise.all
  static all(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Promise.all accepts an array"));
      }

      if (promises.length === 0) {
        return resolve([]);
      }

      const results = [];
      let completedCount = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (value) => {
            results[index] = value;
            completedCount++;

            if (completedCount === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  // 静态方法：Promise.race
  static race(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Promise.race accepts an array"));
      }

      promises.forEach((promise) => {
        Promise.resolve(promise).then(resolve, reject);
      });
    });
  }

  // 静态方法：Promise.allSettled
  static allSettled(promises) {
    return new Promise((resolve) => {
      if (!Array.isArray(promises)) {
        return resolve([]);
      }

      if (promises.length === 0) {
        return resolve([]);
      }

      const results = [];
      let completedCount = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (value) => {
            results[index] = { status: "fulfilled", value };
            completedCount++;

            if (completedCount === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
            completedCount++;

            if (completedCount === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  // 静态方法：Promise.any
  static any(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Promise.any accepts an array"));
      }

      if (promises.length === 0) {
        return reject(new AggregateError([], "All promises were rejected"));
      }

      const errors = [];
      let rejectedCount = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            errors[index] = reason;
            rejectedCount++;

            if (rejectedCount === promises.length) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          }
        );
      });
    });
  }
}

module.exports = Promise;
