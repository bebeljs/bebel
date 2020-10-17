module.exports = function (param) {

  let res = 0
  if (Array.isArray(param)) {
    param.forEach(v => {
      if (Array.isArray(v)) {
        v = this[v[0]](v[1])
      }
      res += v
    })
  }
  return res
}