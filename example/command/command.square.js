module.exports = function (param) {

  let res
  if (Array.isArray(param)) {
    res = this[param[0]](param[1]) ** 2
  } else {
    res = param ** 2
  }
  return res
}