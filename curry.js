// 函数的柯里化

// 柯里化：就是将一个函数拆分成多个细小的函数
// 判断类型 Object.prototype.toString.call(‘123’)

{
    function checkTpye(isString){
        return (content)=>{
           return Object.prototype.toString.call(content) === `[object ${isString}]`
       }
   }
   
   let  arr = ["String","Number","Boolean"]
   let utils ={}
   arr.forEach((type)=>{
       utils[`is${type}`] = checkTpye(type)
   })
   console.log(utils.isString("123"))
}

{
    const add = (a,b,c,d,e)=>{
        return a+b+c+d+e
     }
     
     // 经典的函数柯里化
     const curring = (fn,arr = [])=>{
         let len = fn.length;
         return (...args)=>{
            arr =  arr.concat(args)
            if(arr.length < len){
                 return curring(fn,arr)
            }else{
                 return fn(...arr)
            }
         }
        
     }
     let total = curring(add)(1)(2)(3)(4)(5)
     console.log("total:",total)
     
}
{
    const curring = (fn,arr = [])=>{
        let len = fn.length;
        return (...args)=>{
           arr =  arr.concat(args)
           if(arr.length < len){
                return curring(fn,arr)
           }else{
                return fn(...arr)
           }
        }
       
    }
    function checkTpye(isString){
        return (content)=>{
          return Object.prototype.toString.call(content) === `[object ${isString}]`
       }
   }
   
   let  arr = ["String","Number","Boolean"]
   let utils ={}
   arr.forEach((type)=>{
       utils[`is${type}`] = curring(checkTpye)(type)
   })
   console.log(utils.isString('123'))
}

