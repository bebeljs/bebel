/*!
 * bebel
 * Copyright(c) 2020 Julien Arlandis
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const axios = require('axios')

/**
 * This is the class who are registry all resources of API
 * @class
 */

module.exports = class {
  /**
   * @constructor
   * @property $query contain Query object relative of request and response HTTP
   * @property $express is the express instance of the application
   * @property $method is declared by prototype as Array
   * @property $eventEmitter is declared by prototype as events.EventEmitter
   * @property $rootDirectory
   */

  constructor () {
    this.$query = null
    this.$express = null
  }

  /**
   * Start session, this function can be replace with a function
   * declared in a file named 'this.sessionStart.js' placed in config.directory
   * @public
   */

  sessionStart () {
    return new Promise(resolve => {
      this.$query.res.header('Access-Control-Allow-Origin', '*')
      this.$query.res.header('Access-Control-Allow-Headers', '*')
      resolve()
    })
  }

  /**
   * get a bebel request at any bebel server
   * @param {Array} command this is a bebel request as [command, parameter]
   * @param {String} uri uri of bebel server 'http://hostname:port'
   */

  $exec (command, uri = false) {
    if (uri) {
      return new Promise(resolve => {
        axios.create({
          method: 'post',
          baseURL: uri,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })({ data: command })
          .then((res) => {
            resolve(res.data)
          })
      })
    } else {
      if (typeof command[0] === 'string') {
        if (typeof this[command[0]] === 'function') {
          return (this[command[0]](command[1]))
        } else {
          return this[command[0]]
        }
      } else {
        return command
      }
    }
  }

  /**
   * set $express property
   * @param {Object} express
   * @return this
   */

  $setExpress (express) {
    this.$express = express
    return this
  }

  /**
   * set $query property
   * @param {Object} query
   * @return this
   */

  $setQuery (query) {
    this.$query = query
    return this
  }
}
