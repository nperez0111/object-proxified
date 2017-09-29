const makeNewProxy = require('../')
const log => (...args) => { args.forEach(a => { console.log(a) }) }

const testly = (el) => {
    const past = { click: [] }
    return makeNewProxy(el, {}, {
        onclick(obj, property, value) {
            if (value === null || value === false || value === undefined || value.toLowerCase() == 'remove') {
                obj.removeEventListener("click", past.click.pop())
            }
            past.click.push(value)
            obj.addEventListener.apply(null, "click", value, false)
            return value
        }
    })
}
