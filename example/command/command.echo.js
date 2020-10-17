module.exports = function (param) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        info: 'echo with 3 seconds delay. Can you compute this expression ["square", ["sum", [2, ["square", ["sum", [2, 3]]]]]]',
        body: param
      })
    }, 3000)
  })
}