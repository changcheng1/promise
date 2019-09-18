// 高阶函数
// 一个函数的参数是一个函数(回调)
// 一个函数返回一个函数(拆分函数)


// 函数的befor
// AOP 切片 装饰
// 希望将核心逻辑拆分出来吗，在外面增加功能
Function.prototype.before = function(bfroreFn){
    return (...arg)=>{        // 箭头函数没有this指向，所以会向上级作用域查找
        bfroreFn();
        this(...arg); 
    }
}

function say(...arg){
    console.log("arg:",arg)
}

const newSay = say.before(()=>{
    console.log("新增加的方法")
})
newSay(1,2,3,4)


// js模拟事务
let perform = ((fn,wrappers)=>{
    wrappers.forEach(element => {
        element.initlizae();
    });
    fn();
    wrappers.forEach(element => {
        element.close();
    });
})


perform(()=>{
  console.log("say")
},[{
    initlizae(){
        console.log("hello")
    },
    close(){
        console.log("bye")
    }
}])

