# Bebel — a simple http API builder

`Bebel` is a simple, fast, and minimalist API builder.
`Bebel protocol` is also a specification based on JSON format to define how a client should request, and how a server should respond to those requests.

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

## Usage

```js
const Bebel = require('bebel')
const directory = 'example'
const port = 8000

new Bebel({directory})
  .listen(port)
  .start()
```

## API ##
Creates a bebel API.
```js
const Bebel = require('bebel')
const api = new Bebel(options, https_param)
```
* **options**: `Object`
  * **directory**: `String` (default: 'root')
  Path of directory that contains all commands.
* **https_param**: `Object` (default: false)
  * **key**: `String`
  Path of private key.
  * **cert**: `String`
  Path of certificate.

If https_param is omitted the server is started in http.

#### Methods ####

```js
api.listen(port)
```
  * **port**: `Number` (default: 8000)
Binds and listens for connections on the specified host and port.
---------------------------

```js
api.start()
```
Start bebel server, return a promise.
```js
api.start()
  .then(THIS => {
    console.log(THIS.meteo("montpellier"))
  })
```
We notice in this example that `meteo` command can be invoked directly as a function from the callback of the promise.

---------------------------
```js
api.registry(name, type, func)
```

```js
var api = new API({ directory })
api.start().then(THIS => {
  api.registry('square', 'command', x => x ** 2)
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

In the example, `THIS` is an object which contains all the resources declared by the registry method. It also contains native methods like `sessionStart` invoked on each connection. `sessionStart` can be redefined by the registry method.

Any javascript file present in the root directory or will automatically be transformed into resources if it is named with the prefix `command.` or `this.` or `instance.`

#### Example
***command.square.js*** :
```js
module.exports = function () {
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
$ git clone https://github.com/bebeljs/bebel.git
$ cd bebel
$ npm install
$ npm run example
```
View the website at: http://localhost:8000

## License

  [MIT](LICENSE)