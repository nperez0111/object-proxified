const log => (...args) => { args.forEach(a => { console.log(a) }) }

const nuevo = (before = []) => makeNewProxy(before, {
    size(obj) {
        return obj.length
    },
    sortf(obj) {
        return comp => nuevo([...obj].sort(comp))
    },
    shuffle(obj) {
        return nuevo([...obj].sort(() => (Math.random() - 0.5) > 0 ? -1 : 1))
    }
})

const spy = nuevo()
log(spy)
spy[0] = 1
spy[1] = 2
log(spy)
log(spy.size)
log(spy.shuffle.size)
