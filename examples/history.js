const makeNewProxy = require('../')
const log => (...args) => { args.forEach(a => { console.log(a) }) }

const see = (function(originalObj) {
    const copy = obj => Object.assign({}, obj)
    let past = [copy(originalObj)]
    return makeNewProxy(originalObj, {
        first(obj) {
            return obj
        },
        last(obj) {
            return past[past.length - 1]
        },
        index(obj) {
            return index => {
                return past[index]
            }
        },
        length(obj) {
            return past.length
        },
        revert(obj) {
            return (howManyTimes = 1) => {
                const removed = past.slice(0, howManyTimes)
                past = past.slice(howManyTimes)
                return removed
            }
        }
    }, {
        defaultCase(proxy, prop, val, target) {
            const newest = copy(proxy)
            newest[prop] = val
            past = [newest, ...past]
            return val
        }
    })
})({})

log(see)
see.a = 1
log(see)
see.b = 2
log(see)
see.a = { c: 23 }
log(see)
log("start")
for (let i = 0; i < see.length; i++) {
    log(see.index(i))
}
log("end")
