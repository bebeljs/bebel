module.exports = function () {
  if (this.$query.req.get('cookie') !== undefined) {
    const session = this.$query.req.get('cookie').split('=')[1]
    return {
      info: `You are ${session}, try ["stat"] command`,
      body: `${session}`
    }
  } else {
    return {
      info: `You are not connected`,
      body: false
    }
  }
}