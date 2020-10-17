/*!
 * bebel
 * Copyright(c) 2020 Julien Arlandis
 * MIT Licensed
 */

const API = require('../lib/bebel')
const directory = 'example'
const port = 8000

var api = new API({ directory })
api.registry('square', 'command', x => x ** 2)
api.listen(port)
api.start()
  .then(THIS => {
    console.log(`test square command, square(9) = ${THIS.square(9)}`)
  })
