{
    const after = (time,fn)=>{
        return ()=>{
            time -- 
            if(time == 0){
                fn();
            }
        }
    }
    const newAfter = after(3,()=>{
        console.log("第三次才调用");
    })
    
    newAfter();
    newAfter();
    newAfter();
}
{ 
    let school = {}
    // 并发的问题 计数器
    const fs = require('fs')
    // 缩写
    const after = (time,fn)=>()=>{--time === 0 && fn()}
    const newAfter = after(2,()=>{
        console.log(school);
    })
    fs.readFile('./data/name.txt','utf8',(err,data)=>{
        school["name"] = data
        newAfter()
    })

    fs.readFile('./data/age.txt','utf8',(err,data)=>{
        school["age"] = data
        newAfter()
    })
}
