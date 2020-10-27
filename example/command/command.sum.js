module.exports = function (param) {

  let res = 0
  if (Array.isArray(param)) {
    param.forEach(v => {
      res += this.$exec(v)
    })
  }
  return res
}