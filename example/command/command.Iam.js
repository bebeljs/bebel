module.exports = function (name) {
  if (typeof name === 'string') {
    this.$query.res.cookie('bebel-session', name)
    return {
      info: `Welcome ${name}, now you can check command ["whoami"]`,
      body: name
    }
  } else {
    return {
      code: 'error',
      info: 'absent parameter, example : ["Iam", "Julien"]',
      body: false
    }
  }
}
