module.exports = class {
  constructor (application) {
    application.$eventEmitter.on('onStart', THIS => THIS.onStart())
    application.$eventEmitter.on('beforeExec', THIS => THIS.beforeExec())
    application.$eventEmitter.on('afterExec', THIS => THIS.afterExec())
  }
}
