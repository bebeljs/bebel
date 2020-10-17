/*!
 * bebel
 * Copyright(c) 2020 Julien Arlandis
 * MIT Licensed
 */

const API = require('../lib/bebel')
const directory = 'example'
const port = 8000

var api = new API({ directory })
api.listen(port)
api.start()
  .then(THIS => {
  })
