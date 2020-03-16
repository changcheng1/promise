const PEDDING = 'pedding'
const REJECTED = 'rejected'
const FULFILLED = 'fufilled'
class Promise{
    constructor(executor){
        this.value = undefined;
        this.reson = undefined;
        this.status = PEDDING;
        // 用于异步订阅
        this.onResolveCallBacks = []
        this.onRejectCallBacks = []
        let resolve = (val)=>{
            if(this.status == PEDDING){
                this.value = val;
                this.status = REJECTED
                // 发布
                this.onResolveCallBacks.forEach(fn=>fn())
            }
        }
        let reject = (res)=>{
          if(this.status == PEDDING){
            this.reson = res    
            this.status = FULFILLED
            // 发布
            this.onRejectCallBacks.forEach(fn=>fn())
          }
        }
        // 捕获new Promise时发生的错误
        try{
            executor(resolve,reject)
        }catch(err){
            reject(err)
        }
    }
    then(onRejected,onFulfilled,){
        if(this.status == REJECTED){
            onRejected(this.value)
        }
        if(this.status == FULFILLED){
            onFulfilled(this.reson)
        }
        // 用于异步的订阅
        if(this.status == PEDDING){
            this.onResolveCallBacks.push(()=>{
                onRejected(this.value)
            });
            this.onRejectCallBacks.push(()=>{
                onFulfilled(this.reson)
            })
        }
    }
}
module.exports = Promise