import test from 'ava';
import fn from './';
let x = fn({
        a: {
            c: 1
        },
        b: 2,
        d: true
    }),
    please = fn(x)

test('Pick Method', t => {
    t.true(x.pick('d'))
    t.deepEqual(x.pick(['d', 'b']), {
        b: 2,
        d: true
    })
    t.throws(function() {
        x.pick('notExistent')
    })
})

test('Keys Method', t => {
    t.deepEqual(x.keys, ['a', 'b', 'd'])
})

test('Values Method', t => {
    t.deepEqual(x.values, [{
        c: 1
    }, 2, true])
})

test('ForEach Method', t => {
    var i = 0;
    x.forEach(function() {
        i++
    })
    t.deepEqual(i, 3)
})

test('Map Method', t => {
    t.deepEqual(x.map(function(cur, key) {
        return key
    }), {
        a: 'a',
        b: 'b',
        d: 'd'
    })
})

test('Every Method', t => {
    t.true(x.every(function(a) {
        return a === a;
    }))
    t.false(x.every(function(a) {
        return Number(a) === a;
    }))
})

test('Some Method', t => {
    t.true(x.some(function(a) {
        return Number(a) === a
    }))
})

test('Filter Method', t => {
    t.deepEqual(x.filter(function(a) {
        return Number(a) === a
    }), {
        b: 2
    })
})

test('Keyof Method', t => {
    t.deepEqual(x.keyOf(true), "d")
    t.deepEqual(x.keyOf([true]), ["d"])
})

test('Includes Method', t => {
    t.true(x.includes(true))
    t.false(x.includes("notExistent"))
        //includes is not using deep equality checks
    t.false(x.includes({
        c: 1
    }))
})

test('Has Method', t => {
    t.true(x.has('a'))
    t.false(x.has('notExistent'))
})

test('Copy Method', t => {
    let y = fn({
        s: 3
    })
    t.deepEqual(y.copy, {
        s: 3
    })
})

test('Remove Method', t => {
    let y = fn({
        d: 34,
        c: 35,
        f: 34,
        l: 25
    })
    t.is(y.remove("d"), 34)
    t.deepEqual(y, {
        c: 35,
        f: 34,
        l: 25
    })
    t.deepEqual(y.remove(["c", "f"]), [35, 34])
})

test('Extend Method', t => {
    let y = fn({
        d: 3
    })
    t.deepEqual(y.extend({
        x: 3
    }), {
        d: 3,
        x: 3
    })
    t.deepEqual(y, {
        d: 3
    })
})

test('Assign Method', t => {
    let y = fn({
        d: 3
    })
    t.deepEqual(y.assign({
        x: 3
    }), {
        d: 3,
        x: 3
    })
    t.deepEqual(y, {
        d: 3,
        x: 3
    })
    t.deepEqual(fn({
        a: {
            b: 2,
            c: 4
        }
    }).assign({
        a: {
            b: 4,
            d: 3
        }
    }), {
        a: {
            b: 4,
            c: 4,
            d: 3
        }
    })
})
