// Lets create the famous isset function in php that checks if a variable is set or not

function isset(variable){
    return typeof (variable) !== 'undefined' ;
}

function count (mixedVar, mode) {

  let key
  let cnt = 0
  if (mixedVar === null || typeof mixedVar === 'undefined') {
    return 0
  } else if (mixedVar.constructor !== Array && mixedVar.constructor !== Object) {
    return 1
  }
  if (mode === 'COUNT_RECURSIVE') {
    mode = 1
  }
  if (mode !== 1) {
    mode = 0
  }
  for (key in mixedVar) {
    if (mixedVar.hasOwnProperty(key)) {
      cnt++
      if (mode === 1 && mixedVar[key] &&
        (mixedVar[key].constructor === Array ||
          mixedVar[key].constructor === Object)) {
        cnt += count(mixedVar[key], 1)
      }
    }
  }
  return cnt
}

function is_array (mixedVar) { // eslint-disable-line camelcase

  const _getFuncName = function (fn) {
    const name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  const _isArray = function (mixedVar) {
    if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
      return false
    }
    const len = mixedVar.length
    mixedVar[mixedVar.length] = 'bogus'
    if (len !== mixedVar.length) {
      mixedVar.length -= 1
      return true
    }
    delete mixedVar[mixedVar.length]
    return false
  }
  if (!mixedVar || typeof mixedVar !== 'object') {
    return false
  }
  const isArray = _isArray(mixedVar)
  if (isArray) {
    return true
  }
  const iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.objectsAsArrays') : undefined) || 'on'
  if (iniVal === 'on') {
    const asString = Object.prototype.toString.call(mixedVar)
    const asFunc = _getFuncName(mixedVar.constructor)
    if (asString === '[object Object]' && asFunc === 'Object') {
      // Most likely a literal and intended as assoc. array
      return true
    }
  }
  return false
}



function substr (input, start, len) {
  const _php_cast_string = require('../_helpers/_phpCastString') // eslint-disable-line camelcase
  input = _php_cast_string(input)
  const ini_get = require('../info/ini_get') // eslint-disable-line camelcase
  const multibyte = ini_get('unicode.semantics') === 'on'
  if (multibyte) {
    input = input.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
  }
  const inputLength = input.length
  let end = inputLength
  if (start < 0) {
    start += end
  }
  if (typeof len !== 'undefined') {
    if (len < 0) {
      end = len + end
    } else {
      end = len + start
    }
  }
  if (start > inputLength || start < 0 || start > end) {
    return false
  }
  if (multibyte) {
    return input.slice(start, end).join('')
  }
  return input.slice(start, end)
}
