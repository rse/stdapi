/*
**  StdAPI -- Standard Application Programming Interface Base Class
**  Copyright (c) 2017-2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

const chai = require("chai")
const { expect } = chai
chai.config.includeStack = true

var StdAPI = require("../lib/stdapi.node.js")

describe("StdAPI Library", () => {
    it("API availability", () => {
        const stdapi = new StdAPI()
        expect(stdapi).to.respondTo("set")
        expect(stdapi).to.respondTo("on")
        expect(stdapi).to.respondTo("emit")
        expect(stdapi).to.respondTo("at")
        expect(stdapi).to.respondTo("hook")
        expect(stdapi).to.respondTo("debug")
    })
    it("options functionality", () => {
        class Test extends StdAPI {
            constructor (options) {
                super(options, {
                    foo: [ "string", "foo" ],
                    bar: [ "string", "bar" ]
                })
            }
        }
        const test = new Test({ bar: "baz" })
        expect(test.$.debug).to.be.equal(0)
        expect(test.$.bar).to.be.equal("baz")
        expect(test.$.foo).to.be.equal("foo")
        test.set({ foo: "bar" })
        expect(test.$.foo).to.be.equal("bar")
        expect(() => { void (new Test({ dummy: "dummy" })) }).to.throw(Error)
        expect(() => { void (new Test({ foo: 42 })) }).to.throw(Error)
    })
    it("event functionality", () => {
        const stdapi = new StdAPI()
        let ok = false
        stdapi.on("foo", (arg1, arg2) => { ok = (arg1 === "bar" && arg2 === "quux") })
        stdapi.emit("foo", "bar", "quux")
        expect(ok).to.be.equal(true)
    })
    it("hook functionality", () => {
        const stdapi = new StdAPI()
        stdapi.at("foo", (arg, ctx) => `${ctx}:baz`)
        stdapi.at("foo", (arg, ctx) => `${ctx}:quux`)
        expect(stdapi.hook("foo", "pass", "bar")).to.be.equal("bar:baz:quux")
    })
    it("async hook functionality", async () => {
        const stdapi = new StdAPI()
        stdapi.at("foo", async (arg, ctx) => `${await ctx}:baz`)
        stdapi.at("foo", async (arg, ctx) => `${await ctx}:quux`)
        const result = await stdapi.hook("foo", "promise", "bar")
        expect(result).to.be.equal("bar:baz:quux")
    })
})

