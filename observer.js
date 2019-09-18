class Subject{
    constructor(){
        // 存放观察者
        this.arr = []
        this.state = '开心'
    }
    chageState(newState){
        this.state = newState
        this.arr.forEach(item=>{
            item.update(this.state)
        })
    }
    attach(o){
        this.arr.push(o)
    }
}

class Parent{
    constructor(name){
        this.name = name
    }
    update(state){
        console.log(this.name+'的小宝宝:'+state)
    }
}

let child = new Subject()

let observer = new Parent("父亲")

let observer1 = new Parent("母亲")

child.attach(observer)
child.attach(observer1)
child.chageState('不开心了')