let { add, mul } = require('./a.js')
let _ = require('lodash')
let result = add(10, 20)
let sum = mul(10, 20)
console.log(result, sum)
const arr = _.concat([1, 2], 3)
console.log('arr...', arr)