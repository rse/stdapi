/*
**  StdAPI -- Standard Application Programming Interface Base Class
**  Copyright (c) 2017-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  import external requirements  */
import Promise           from "promise"
import objectAssign      from "object-assign"
import EventEmitter      from "eventemitter3"
import Latching          from "latching"
import Ducky             from "ducky"

/*  provide API class  */
class StdAPI {
    constructor (options, spec) {
        /*  define empty internal state  */
        Object.defineProperty(this, "_", {
            configurable: false,
            enumerable:   false,
            writable:     false,
            value:        {}
        })

        /*  determine options  */
        spec = objectAssign({}, spec, { debug: [ "number", 0 ] })
        options = Ducky.options(spec, options)
        Object.defineProperty(this, "$", {
            configurable: false,
            enumerable:   false,
            writable:     false,
            value:        options
        })

        /*  provide hook latching sub-system  */
        Object.defineProperty(this, "__latching", {
            configurable: false,
            enumerable:   false,
            writable:     false,
            value:        new Latching()
        })

        /*  provide a special Promise-based hook processing  */
        this.__latching.proc("promise",
            (p)    => Promise.resolve(p),
            (o, n) => o.then(() => n)
        )

        /*  provide event emitter sub-system  */
        Object.defineProperty(this, "__emitter", {
            configurable: false,
            enumerable:   false,
            writable:     false,
            value:        new EventEmitter()
        })
    }

    /*  provide reconfiguration  */
    set (...args) {
        if (args.length === 2 && typeof args[0] === "string")
            args = { [ args[0] ]: args[1] }
        else if (!(args.length === 1 && typeof args[0] === "object"))
            throw new Error("set: invalid arguments")
        this.$.merge(...args)
        return this
    }

    /*  provide event listening  */
    on (name, handler) {
        this.__emitter.on(name, handler)
        return () => {
            this.__emitter.removeListener(name, handler)
        }
    }

    /*  provide event emitting  */
    emit (name, ...args) {
        this.__emitter.emit(name, ...args)
        return this
    }

    /*  provide hook latching  */
    at (name, handler) {
        this.__latching.latch(name, handler)
        return () => {
            this.__latching.unlatch(name, handler)
        }
    }

    /*  provide hook usage  */
    hook (name, preproc, ...args) {
        return this.__latching.hook(name, preproc, ...args)
    }

    /*  provide debug logging  */
    debug (level, msg) {
        if (level <= this.$.debug) {
            let date = (new Date()).toISOString()
            let log = `${date} DEBUG [${level}]: ${msg}`
            let event = { date, level, msg, log }
            event = this.hook("debug", "pass", event)
            if (event !== null)
                this.emit("debug", event)
        }
        return this
    }
}

/*  export API class  */
module.exports = StdAPI

