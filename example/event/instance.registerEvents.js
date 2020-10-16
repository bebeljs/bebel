module.exports = class {

  constructor( THIS ) {
    THIS.$eventEmitter.on('startServer', (THAT) => THAT['onStart']())
    THIS.$eventEmitter.on('beforeExec', (THAT) => THAT['beforeExec']())
    THIS.$eventEmitter.on('afterExec', (THAT) => THAT['afterExec']())
  }
}
