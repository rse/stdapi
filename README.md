
StdAPI
======

Standard Application Programming Interface Base Class

<p/>
<img src="https://nodei.co/npm/stdapi.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/stdapi.png" alt=""/>

About
-----

This is a small JavaScript library for the Browser and Node.js,
providing a base class for a standard Application Programming
Interface (API) based on the usual functionalities constructor options, event emitting
and hook latching. Internally, the functionality
is directly based on [Ducky](https://duckyjs.com) `options`,
[EventEmitter3](https://github.com/primus/eventemitter3) and
[Latching](https://github.com/rse/latching).
The purpose of this base class is to reduce the necessary
boilerplate code for implementing standard APIs.

Installation
------------

```shell
$ npm install stdapi
```

Usage
-----

```js
class MyClass extends StdAPI {
    constructor (options) {
        super(options, {
            name: [ "string" ],
            foo: [ "string", "bar" ],
            bar: {
                baz:  [ "number", 42 ]
                quux: [ "boolean", () => true ]
            }
        })
    }
    foo (arg) {
        this.debug(1, "foo called")
        arg = this.hook("foo", "pass", arg)
        void (arg) /* ... */
        this.emit("foo done")
        return this
    }
}
```

License
-------

Copyright (c) 2017 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

