const makeNewProxy = require('../')
const log => (...args) => { args.forEach(a => { console.log(a) }) }

const promiser = anything => makeNewProxy(anything, {
    promise(obj) {
        return Promise.resolve(obj)
    },
    toPromise(obj) {
        return Promise.resolve(obj)
    },
    toRejectedPromise(obj) {
        return Promise.reject(obj)
    }
})
const promised = promiser({ a: 2 })
log(promised.promise)
promiser([1, 23]).toRejectedPromise.catch(log)
