/*!
 * bebel
 * Copyright(c) 2020 Julien Arlandis
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const https = require('https')
const Express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const clc = require('colors/safe')
const events = require('events')
const Query = require('./query')
const Application = require('./application')

/**
 * Principal class for bebel init
 * @class
 */

module.exports = class {
  /**
   * @constructor
   * @param {String} config.directory update bebel directory
   * @property {String} directory bebel directory
   * @property {Array } resources list of resources (command, this and instance)
   * @property {Object} application object that contains all the API resources
   * @property {Boolean} started true if API is started, false otherwise
   */

  constructor (config) {
    this.directory = (typeof config.directory === 'string') ? config.directory : 'root'
    this.application = new Application()
    this.started = false
    this.resources = this.findResources('.js', this.directory)
  }

  /**
   * initialise bebel
   * @public
   * @return this.application
   */

  start () {
    if (!this.started) {
      Application.prototype.$eventEmitter = new events.EventEmitter()
      Application.prototype.$rootDirectory = this.directory
      this.loadFilesResources()
      this.started = true
    }
    return new Promise(resolve => resolve(this.application))
  }

  /**
   * Registry a new resource for bebel
   * @public
   * @param {String} name name of resource
   * @param {String} method method of resource among 'this', 'instance' or 'command'
   * @param {Object} value any javascript object to become a resource
   */

  registry (name, method, value) {
    if (Application.prototype.$method === undefined) {
      Application.prototype.$method = []
    }
    try {
      if (method === 'instance') {
        const ObjectToInstance = (typeof value === 'string') ? require(value) : value
        Application.prototype[name] = new ObjectToInstance(this.application)
      } else {
        const resource = (typeof value === 'string') ? require(value) : value
        Application.prototype[name] = resource
      }
      Application.prototype.$method[name] = method
      console.log(`${clc.cyan(name)}: ${clc.blue(method)} ${clc.green(typeof Application.prototype[name])}`)
      return this
    } catch (e) {
      console.log(`${clc.cyan(name)}: ${clc.blue(method)} ${clc.red(e)}`)
      return e
    }
  }

  /**
   * Search and returns recursively all resource present in config.directory
   */

  findResources (regex, directory, filepaths = []) {
    const files = fs.readdirSync(directory)
    for (const filename of files) {
      const filepath = path.join(directory, filename)
      if (fs.statSync(filepath).isDirectory()) {
        this.findResources(regex, filepath, filepaths)
      } else if (path.extname(filename) === regex) {
        if (filename.split('.').length === 3) {
          const method = filename.split('.')[0]
          if (['command', 'this', 'instance'].indexOf(method) !== -1) {
            filepaths.push({
              method,
              resource: filename.split('.')[1],
              path: filepath
            })
          }
        }
      }
    }
    return filepaths
  }

  /**
   * list resources before registry
   */

  loadFilesResources () {
    // first we need to registry 'this' and 'command' resources
    this.resources.filter(v => ['this', 'command'].indexOf(v.method) !== -1).forEach(v => {
      this.registry(v.resource, v.method, path.join(process.cwd(), v.path))
    })

    // then we assign 'instance' resources
    this.resources.filter(v => v.method === 'instance').forEach(v => {
      this.registry(v.resource, v.method, path.join(process.cwd(), v.path))
    })
  }

  /**
   * @public
   * @param {Number} port port of running application by express
   * @param {Object} cert private key and certificate for https
   * @return this
   */

  listen (port = 8000, cert = false) {
    if (!this.started) {
      this.start()
    }
    const express = Express()
    express.use(bodyParser.text({ type: '*/*', limit: '15mb' }))
    express.set('port', port)

    try {
      if (typeof cert.key === 'string' && typeof cert.cert === 'string') {
        https.createServer({
          key: fs.readFileSync(cert.key),
          cert: fs.readFileSync(cert.cert)
        }, express).listen(express.get('port'))
      } else {
        express.listen(express.get('port'), () => {})
      }
      this.application.$setExpress(express)
      this.application.$eventEmitter.emit('onStart', this.application)
    } catch (e) {
      console.log(clc.red(`Can not start server : [${e}]`))
    }

    express.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Server', 'bebel/' + process.env.npm_package_version)
      next()
    })

    express.post('/', (req, res) => new Query(req, res))

    return this
  }
}
