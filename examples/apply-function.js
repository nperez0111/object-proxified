const log => (...args) => { args.forEach(a => { console.log(a) }) }

const testly = (fn) => makeNewProxy(fn, {
    defaultCase(obj, property) {
        return obj(property)
    }
})

const twoTimes = testly((a) => a * 2)

log(twoTimes[14])
