# Bebel — a simple http API builder

`Bebel` is a simple, fast, and minimalist API builder.
`Bebel protocol` is also a specification based on JSON format to define how a client should request, and how a server should respond to those requests. Bebel uses a functional paradigm, and can be used for computational sciences.

## Specification of bebel protocol

Bebel query is sent via the post method of http.
#### Bebel query
```js
[commandName, parameter]
```
**commandName**: `String` [require] 
Name of the command to call.

**parameter**: `JSON object` [optional]
Parameter of the command (string, number, booolean, array or object value).

--------------------------
#### Bebel response
```js
{
  code,
  info,
  body
}
```
**code**: `String` [require]
Header response amont "success" or "error" values.

**info**: `String` [require]
Information intended to be read by a human.

**body**: `JSON object` [require]
Body response of the command.

## Examples of bebel transaction

```js
// query
["pi"]

// response
{
  "code": "success",
  "info": "π value",
  "body": 3.141592653589793
}
```

```js
// query
["authenfication", {
  "login": "julien",
  "password": "Pa$sW0rD!"
}]

// response
{
  "code": "success",
  "info": "Welcome Julien",
  "body": true
}
```

```js
// query
["meteo", "montpellier"]

// response
{
  "code": "success",
  "info": "What a beautiful weather in Montpellier",
  "body": {
    "temperature": "26°",
    "humidity": "13%" 
  }
}
```
```js
// query
["square", 10]

// response
{
  "code": "success",
  "info": "square executed",
  "body": 100
}
```

```js
// query
["sum", [2, 3, 4]]

// response
{
  "code": "success",
  "info": "sum executed",
  "body": 9
}
```

By combining the two instructions `square` and `sum` commands :
```js
// query
["square", ["sum", [2, ["square", 3]]]]
// equal to
["square", ["sum", [2, 9]]]
// equal to
["square", 11]

// response
{
  "code": "success",
  "info": "square executed",
  "body": 121
}
````

## Usage

```js
const Bebel = require('bebel')
const directory = 'example'
const port = 8000

new Bebel({ directory })
  .listen(port)
  .start()
```

## API ##
Creates a bebel API.
```js
const Bebel = require('bebel')
const api = new Bebel(options)
```
* **options**: `Object`
  * **directory**: `String` (default: 'root')
  Path of directory that contains all commands.

#### Methods ####

```js
api.listen(port, https_param)
```
  * **port**: `Number` (default: 8000)
Binds and listens for connections on the specified host and port.
* **https_param**: `Object` (default: false)
  * **key**: `String`
  Path of private key.
  * **cert**: `String`
  Path of certificate.

If `https_param` is omitted the server is started in http.

---------------------------
```js
api.start()
```
Start bebel server, return result in a promise. By convention we call the result `THIS` :

```js
api.start()
  .then(THIS => {
    console.log(THIS.meteo("montpellier"))
  })
```
We notice in this example that `meteo` command can be invoked directly as a function from the callback of the promise.
`THIS` is an object which contains all the resources declared by the registry method. It also contains native methods like `sessionStart` invoked on each connection. `sessionStart` can be redefined by the registry method.

---------------------------
```js
api.registry(name, type, func)
```

```js
var api = new API({ directory })
api.registry('square', 'command', x => x ** 2)
api.start().then(THIS => {
  console.log(THIS.square(9))
})
```
  * **name**: `String`
Name of the resource.
  * **method**: `String`
There are 3 types of resources to build a bebel API :
    * `command` defines a resource that can be called via a bebel query or directly as a function.
    * `this` defines a simple function that cannot be invoked via a bebel query.
    * `instance` defines a persistent object that can be called in any function or command.
  * **func**: `Function` or `Class`
  The Javascript code of 
  a function for `command` and `this` resources. The Javascript code of a class for `instance` resources.

Any javascript file present in the root directory will automatically be transformed into resources if it is named with the prefix `command.` or `this.` or `instance.` 
The project tree can be organized in a complex way, the search for resources is **recursive**.

#### Example
***command.square.js*** :
```js
module.exports = function (x) {
  return x ** 2
}
```
defines a command named square.

***instance.shareObject.js*** :
```js
module.exports = class {
  constructor () {
    this.counter = 0
  }
}
```
defines an instance named shareObject.

-----------------------------

#### THIS
All resources are directly linked to this object, it also has some native properties :

  * **$express**: `Object`
  Refers to the [express](https://www.npmjs.com/package/) instance that manages the http socket.

  * **$query**: `Object`
  Refers to the connexion of the command.
    * **req**: `Object Express`
    Request of query.
    * **res**: `Object Express`
    Response of query.
    * **session**: `Object`
    Session of connection.
    * **command**: `String`
    Name of the command.
    * **param**: `Object`
    Parameter of the command at bebel format.
    * **response**: `Object`
    Response of the command at bebel format.

  * **$eventEmitter**: `Object`
    * **onStart**
    This event is triggered when http(s) server starts.
    * **beforeExec**
    This event is triggered before command execution.
    * **afterExec**
    This event is triggered after command execution.
    
  * **$rootDirectory**: `String`
  Path of directory that contains all commands.

#### Example

To call a function before each command execution :
```js
api.start().then(THIS => {
  THIS.$eventEmitter.on('beforeExec', THIS => {
    console.log(`I : ${THIS.$query.command}`)
  })
})
```
However, it is preferable to link the events in an instance resource :

**instance.linkEvent.js**
```js
module.exports = class {
  constructor (application) {
    application.$eventEmitter.on('onStart', THIS => THIS.onStart())
    application.$eventEmitter.on('beforeExec', THIS => THIS.beforeExec())
    application.$eventEmitter.on('afterExec', THIS => THIS.afterExec())
  }
}
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

```bash
$ npm install bebel
```

## Features

  * Handling HTTP responses
  * Protocol based on a JSON object exchange
  * High performance
  * Supports HTTPS
  * Designed to minimize requests between clients and servers

## Examples

  To view the examples, clone the bebel-exemple repo and install the dependencies:

```bash
$ git clone https://github.com/bebeljs/bebel-example.git
$ cd bebel-example
$ npm install
$ npm run example
```
View the website at: http://localhost:8000

## License

  [MIT](LICENSE)