export const defer = function(fn) {
    return Promise.resolve().then(function() {
      return fn()
    })
  }