export const debounce = (func, wait = 300) => {
  let timeoutId = null

  return function debounced(...args) {
    const context = this

    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// debouncer para limitar las llamadas innesesarias a la api
