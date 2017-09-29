const log => (...args) => { args.forEach(a => { console.log(a) }) }
const nuevo = (before = []) => makeNewProxy(before, {
    size(obj) {
        return obj.length
    },
    sortf(obj) {
        return comp => nuevo([...obj].sort(comp))
    },
    reversef(obj) {
        return nuevo([...obj].reverse())
    },
    fillf(obj) {
        return withWhat => nuevo([...obj].fill(withWhat))
    },
    shuffle(obj) {
        return nuevo([...obj].sort(() => (Math.random() - 0.5) > 0 ? -1 : 1))
    },
    ofSize(obj) {
        return length => nuevo(new Array(length)).fill(null)
    },
    ascendingTo(emptyArr) {
        return length => emptyArr.ofSize(length).map((c, i) => i)
    },
    descendingFrom(emptyArr) {
        return length => emptyArr.ofSize(length).map((c, i) => length - i)
    },
    rangeOf(emptyArr) {
        return (fro, to) => emptyArr.ofSize(Math.abs(to - fro)).map((c, i) => i)
    },
    rangeFrom(emptyArr) {
        return fro => { to: to => emptyArr.rangeOf(fro, to) }
    }
})
const spy = nuevo()
log(spy)
spy[0] = 1
spy[1] = 2
log(spy)
log(spy.size)
log(spy.shuffle.size)
