/*!
 * bebel
 * Copyright(c) 2020 Julien Arlandis
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const Application = require('./application')

/**
 * Manage querys of application
 * @class
 */

module.exports = class {
  /**
   * @constructor
   * @property {Object} req request of query (express object)
   * @property {Object} res response of query (express object)
   * @property {Object} session session of connection
   * @property {String} command name of the command
   * @property {Array} param parameter of the command at bebel format
   * @property {Object} response response of the command at bebel format
   */

  constructor (req, res, session) {
    this.req = req
    this.res = res
    this.session = session
    this.command = ''
    this.param = {}
    this.response = {
      code: 'success',
      info: 'process...',
      body: {}
    }
    this.init()
  }

  /**
   * set response.body property
   * @param {Object} body result of command
   */

  setBody (body) {
    this.response.body = body
    return this
  }

  /**
   * set response.code property
   * @param {String} code code of bebel command 'success' or 'error'
   */

  setCode (code) {
    if (typeof code === 'number' || typeof code === 'string') {
      this.response.code = code
    }
    return this
  }

  /**
   * set response.info property
   * @param {String} info textual information for human
   */

  setInfo (info) {
    if (typeof info === 'number' || typeof info === 'string') {
      this.response.info = info
    }
    return this
  }
  /**
   * set bebel response format as
   * {
   *  code: String,
   *  info: String,
   *  body : Object
   * }
   * @param {String} info textual information for human
   */

  setResponse (result) {
    let changeResponse = false
    if (result.body !== undefined) {
      this.setBody(result.body)
      changeResponse = true
    }
    if (result.info !== undefined) {
      this.setInfo(result.info)
      changeResponse = true
    }
    if (result.code !== undefined) {
      this.setCode(result.code)
      changeResponse = true
    }
    if (!changeResponse) {
      this.setBody(result).setCode('success').setInfo(`${this.command} executed`)
    }
    return this.response
  }

  /**
   * Parse bebel command and execute it
   */

  init () {
    const application = new Application()
    application.$setQuery(this)
    application.sessionStart().then(() => {
      try {
        var body = JSON.parse(this.req.body)
        if (typeof body === 'object') {
          if (Array.isArray(body)) {
            if (typeof body[0] === 'string') {
              this.command = body[0]
              this.param = body[1]
              this.execCommand(application)
            } else {
              this.res.send({ code: 'error', info: 'Command is not string' })
            }
          } else {
            this.res.send({ code: 'error', info: 'Not array' })
          }
        } else {
          this.res.send({ code: 'error', info: 'Not object' })
        }
      } catch (e) {
        this.res.send({ code: 'error', info: `Not JSON valid : [${e}]` })
      }
    })
  }

  /**
   * Return result of the bebel command
   * @param {Object} application
   */

  execCommand (application) {
    application.$eventEmitter.emit('beforeExec', application)
    const func = application[this.command]
    if (typeof func !== 'undefined') {
      if (application.$method[this.command] === 'command') {
        if (typeof func === 'function') {
          try {
            const result = application[this.command](this.param)
            application.$eventEmitter.emit('afterExec', application)
            
            if (result !== undefined && typeof result.then === 'function') {
              // promise return
              return result.then(result => {
                this.res.send(this.setResponse(result))
              }).catch(error => {console.error(error)})
            } else if (result !== undefined) {
              // simple return
              this.res.send(this.setResponse(result))
            } else {
              this.res.send({ code: 'error', info: `Command ${this.command} no return` })
            }
            

          } catch (e) {
            // execution error
            console.log(e)
            this.res.send({ code: 'error', info: `Unable to execute command ${this.command} : ${e}` })
          }
        } else {
          // simple value
          const result = func
          return new Promise(resolve => resolve(result))
            .then(result => {
              this.res.send(this.setResponse(result))
              application.$eventEmitter.emit('afterExec', application)
            }).catch(error => {console.error(error)})
        }
      } else {
        // private command
        this.res.send({ code: 'error', info: `Command ${this.command} is private` })
      }
    } else {
      // undefined command
      this.res.send({ code: 'error', info: `Command ${this.command} is not defined` })
    }
  }
}
