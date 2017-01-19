const merge = require('merge'),
    isObj = require('is-obj'),
    makeNewProxy = require('proxify-objects'),
    makeObj = function(keys, values) {
        let ret = {}

        if (Array.isArray(keys) && Array.isArray(values)) {

            keys.forEach((cur, i) => {

                ret[cur] = values[i]

            })

        } else {

            ret[keys] = values

        }

        return ret

    },
    mappings = {
        keys(obj) {
            return Object.keys(obj)
        },
        values(obj) {
            return obj.keys.map(prop => obj[prop])
        },
        mapKeys(obj) {
            const keys = obj.keys
            return doThat => keys.map(function(cur, i) {

                return doThat.call(obj, cur, i, keys)

            })
        },
        mapValues(obj) {
            const vals = obj.values
            return doThat => vals.map(function(cur, i) {

                return doThat.call(obj, cur, i, vals)

            })
        },
        map(obj) {
            return doThat => {
                const keys = obj.keys
                return makeObj(keys, keys.map(function(cur, i) {

                    return doThat.call(obj, obj[cur], cur, obj)

                }))
            }
        },
        pick(obj) {
            return prop => {
                if (Array.isArray(prop)) {

                    let ret = {};
                    prop.forEach((cur) => {

                        ret[cur] = mappings.pick(obj)(cur)

                    })

                    return ret

                }
                if (!obj.hasOwnProperty(prop)) {

                    throw Error(`Object does not have property '${cur}'`)

                }
                return obj[prop]
            }
        },
        forEach(obj) {
            return (fn) => obj.keys.forEach((key) => { fn.call(obj, key, obj[key], obj) })
        },
        every(obj) {
            return check => obj.values.every(check)
        },
        none(obj) {
            return check => !obj.every(obj)(check)
        },
        some(obj) {
            return check => obj.values.some(check)
        },
        filter(obj) {
            const keys = obj.keys,
                vals = obj.values
            return check => {
                let temp = [
                    [],
                    []
                ]
                vals.forEach(function(cur, i, arr) {

                    if (check.call(obj, cur, i, arr)) {

                        temp[0].push(keys[i])
                        temp[1].push(cur)

                    }

                });

                return makeObj(temp[0], temp[1])
            }
        },
        keyOf(obj) {
            return (query, isArray, noError) => {
                if (Array.isArray(query) && !isArray) {

                    return query.map((cur) => {

                        return obj.keyOf(cur)

                    })

                }
                const index = obj.values.indexOf(query)
                if (index === -1) {
                    if (noError) {
                        return undefined;
                    }
                    throw Error(`Object does not have value '${query}'`)
                }
                return obj.keys[index]
            }
        },
        includes(obj) {
            return query => obj.values.indexOf(query) > -1
        },
        has(obj) {
            return query => obj.keys.indexOf(query) > -1
        },
        copy(obj) {
            return makeObj(obj.keys, obj.values)
        },
        remove(obj) {
            return key => {
                if (Array.isArray(key)) {
                    return key.map((element) => {
                        return obj.remove(element)
                    })
                }
                if (obj.hasOwnProperty(key)) {
                    let val = obj[key]
                    delete obj[key]
                    return val
                }
                return false
            }
        },
        extend(obj) {
            return (...args) => merge.recursive.apply(this, [true].concat(obj).concat(args))
        },
        assign(obj) {
            return (...args) => {
                let addDiff = function(that, newObj) {
                    Object.keys(newObj).forEach(function(cur) {
                        if (isObj(newObj[cur])) {
                            if (!that.hasOwnProperty(cur) || !isObj(that[cur])) {
                                that[cur] = {}
                            }
                            addDiff(that[cur], newObj[cur])

                        } else {
                            that[cur] = newObj[cur]
                        }
                    });
                }
                addDiff.call(obj, obj, obj.extend.apply(obj, args))
                return obj;
            }
        },
        get(obj) {
            const options = makeNewProxy({
                allOfType(type) {
                    return obj.filter(value => (typeof value) === type)
                }
            }, {
                numbers(options) {
                    return obj.filter(value => Number(value) === value)
                },
                strings(options) {
                    return obj.filter(value => value.toString() === value)
                },
                arrays(options) {
                    return obj.filter(value => Array.isArray(value))
                },
                bools(options) {
                    return obj.filter(value => value === true || value === false)
                },
                objects(options) {
                    return obj.filter(value => isObj(value))
                }
            })
            return options
        },
        setAs(obj) {
            return transfromFunc => {
                return makeNewProxy({}, {}, {
                    defaultCase(target, property, value) {
                        obj[property] = transfromFunc(value, property)
                    }
                })
            }
        },
        strToObj(obj) {
            return makeNewProxy({}, {}, {
                defaultCase(target, property, value) {
                    obj[property] = JSON.parse(value)
                }
            })
        }
    }


module.exports = obj => makeNewProxy(obj, mappings)
