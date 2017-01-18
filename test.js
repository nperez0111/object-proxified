const x = require('./');

const obj = { age: 52, name: "John", children: [{ name: "Kid", age: 13 }, { name: "Not So Kid", age: 30 }] }
const makeNewProxy = require('proxify-objects')
const newObj = x(obj)
const log = (...args) => args.map(a => {
    console.log(a)
    return a
})
log(newObj.keys)
log(newObj.values)
log("other")
log(newObj.mapKeys(b => b))
log(newObj.mapValues(b => b))
log("another")
log(newObj.get.numbers)
log(newObj.get.strings)
log(newObj.extend({ dt: 34 }))
newObj.setAs(a => Number(a)).key = "90"
log(newObj)

const fn = (val) => val * 2
newObj.key = fn(23)
log(newObj)

newObj.setAs(fn).ke = 3
log(newObj)


const circle = makeNewProxy({ radius: 3, area: 2 }, {
    area(obj) {
        return obj.radius * obj.radius * Math.PI
    }
}, {
    area(target, property, value) {
        circle.radius = Math.sqrt(value / Math.PI)
        return value
    }
})


log(circle)
log(circle.area)
circle.area = 12
log(circle)
log(circle.area)
